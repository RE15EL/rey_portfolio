import Link from "next/link";

import type { IProject } from "@/modules/projects/domain/project";

import { ProjectCardBase } from "./project-card-base";
import { PinContainer } from "./ui";

interface IRecentProjectsProps {
  projects: IProject[];
  hasLoadError?: boolean;
}

export const RecentProjects = ({
  projects,
  hasLoadError = false,
}: IRecentProjectsProps) => {
  return (
    <div id="projects" className="py-20">
      <h1 className="heading ">
        Explora <span className="text-golden-100">Mis Proyectos</span>
      </h1>

      {hasLoadError && (
        <p className="mt-10 text-center text-sm text-amber-300/90">
          No se pudieron cargar los proyectos en este momento. Probá de nuevo en
          unos minutos.
        </p>
      )}

      {!projects.length && !hasLoadError && (
        <p className="mt-10 text-center text-golden-100/70">
          Aun no hay proyectos publicados.
        </p>
      )}

      <div
        className="mt-10 overflow-x-clip px-1 sm:px-2"
        data-testid="projects-overflow-guard"
      >
        <div
          className="mx-auto grid max-w-screen-lg grid-cols-1 justify-items-center gap-6 md:grid-cols-2 md:gap-10 xl:grid-cols-3"
          data-testid="projects-grid"
        >
          {projects.map((project) => {
            const projectHref = project.projectUrl || project.repoUrl || "#";

            return (
              <div
                key={project.id}
                className="w-full min-w-0 max-w-[22rem] md:max-w-full"
              >
                <Link
                  href={projectHref}
                  className="block w-full md:hidden"
                  data-testid="project-mobile-wrapper"
                >
                  <ProjectCardBase project={project} />
                </Link>

                <div
                  className="hidden w-full md:block"
                  data-testid="project-desktop-wrapper"
                >
                  <PinContainer
                    title={project.title}
                    href={projectHref}
                    containerClassName="w-full max-w-full"
                    className="w-full"
                  >
                    <ProjectCardBase
                      project={project}
                      className="w-full border-none bg-transparent p-0 shadow-none"
                    />
                  </PinContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
