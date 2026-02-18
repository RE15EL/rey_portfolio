import { NextResponse } from "next/server";

import {
  buildUnauthorizedResponse,
  getAdminApiContext,
} from "@/lib/auth/get-admin-api-context";
import type { ICreateProjectInput } from "@/modules/projects/domain/project";
import { createProjectsModule } from "@/modules/projects/infrastructure/projects-module";
import { mapProjectErrorToHttp } from "@/modules/projects/presentation/http-errors";

export async function GET() {
  const admin = await getAdminApiContext();
  if (!admin) {
    return buildUnauthorizedResponse();
  }

  try {
    const projectsModule = await createProjectsModule();
    const projects = await projectsModule.listAdminProjects.execute();

    return NextResponse.json({ data: projects });
  } catch (error) {
    const mapped = mapProjectErrorToHttp(error);

    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminApiContext();
  if (!admin) {
    return buildUnauthorizedResponse();
  }

  try {
    const body = (await request.json()) as Partial<ICreateProjectInput>;
    const projectsModule = await createProjectsModule();

    const created = await projectsModule.createProject.execute({
      title: body.title || "",
      slug: body.slug,
      description: body.description || "",
      imageUrl: body.imageUrl,
      projectUrl: body.projectUrl,
      repoUrl: body.repoUrl,
      stack: body.stack,
      isPublished: body.isPublished,
      sortOrder: body.sortOrder,
      updatedBy: admin.email,
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const mapped = mapProjectErrorToHttp(error);

    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
