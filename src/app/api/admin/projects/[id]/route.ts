import { NextResponse } from "next/server";

import {
  buildUnauthorizedResponse,
  getAdminApiContext,
} from "@/lib/auth/get-admin-api-context";
import type { IUpdateProjectInput } from "@/modules/projects/domain/project";
import { createProjectsModule } from "@/modules/projects/infrastructure/projects-module";
import { mapProjectErrorToHttp } from "@/modules/projects/presentation/http-errors";

interface IParams {
  params: { id: string };
}

export async function PATCH(request: Request, context: IParams) {
  const admin = await getAdminApiContext();
  if (!admin) {
    return buildUnauthorizedResponse();
  }

  const { id } = context.params;

  try {
    const body = (await request.json()) as Partial<IUpdateProjectInput>;
    const projectsModule = await createProjectsModule();

    const updated = await projectsModule.updateProject.execute({
      id,
      title: body.title,
      slug: body.slug,
      description: body.description,
      imageUrl: body.imageUrl,
      projectUrl: body.projectUrl,
      repoUrl: body.repoUrl,
      stack: body.stack,
      sortOrder: body.sortOrder,
      updatedBy: admin.email,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    const mapped = mapProjectErrorToHttp(error);

    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
