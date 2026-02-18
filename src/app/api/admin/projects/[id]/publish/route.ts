import { NextResponse } from "next/server";

import {
  buildUnauthorizedResponse,
  getAdminApiContext,
} from "@/lib/auth/get-admin-api-context";
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
    const body = (await request.json()) as { isPublished?: boolean };
    const projectsModule = await createProjectsModule();

    const project = await projectsModule.setProjectPublished.execute(
      id,
      Boolean(body.isPublished),
      admin.email
    );

    return NextResponse.json({ data: project });
  } catch (error) {
    const mapped = mapProjectErrorToHttp(error);

    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
