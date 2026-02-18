import { NextResponse } from "next/server";

import { createProjectsModule } from "@/modules/projects/infrastructure/projects-module";
import { mapProjectErrorToHttp } from "@/modules/projects/presentation/http-errors";

export async function GET() {
  try {
    const projectsModule = await createProjectsModule();
    const projects = await projectsModule.listPublishedProjects.execute();

    return NextResponse.json({ data: projects });
  } catch (error) {
    const mapped = mapProjectErrorToHttp(error);

    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
