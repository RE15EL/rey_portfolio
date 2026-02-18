import Image from "next/image";

import type { IProject } from "@/modules/projects/domain/project";

import { PinContainer } from "./ui";

interface IRecentProjectsProps {
  projects: IProject[];
}

export const RecentProjects = ({ projects }: IRecentProjectsProps) => {
  return (
    <div id="projects" className="py-20">
      <h1 className="heading ">
        Explora <span className="text-golden-100">Mis Proyectos</span>
      </h1>

      {!projects.length && (
        <p className="mt-10 text-center text-golden-100/70">
          Aun no hay proyectos publicados.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-y-4 p-4 md:gap-x-20 md:gap-y-0">
        {projects.map(
          ({ description, id, imageUrl, projectUrl, repoUrl, stack, title }) => (
            <div
              key={id}
              className="flex h-[24rem] w-full items-center justify-center md:w-96 lg:min-h-[32rem]"
            >
              <PinContainer
                title={title}
                href={projectUrl || repoUrl || "#"}
                containerClassName="w-full"
              >
                <div className="relative mb-10 flex h-[20vh] w-full items-center justify-center overflow-hidden sm:w-96 lg:h-[30vh]">
                  <div className="size-full">
                    <Image
                      src={imageUrl || "/images/taskmind.png"}
                      alt={title}
                      fill
                      className="rounded-t-lg object-cover"
                    />
                  </div>
                </div>

                <h1 className="line-clamp-1 text-base font-bold text-golden-100 md:text-xl lg:text-2xl">
                  {title}
                </h1>

                <p className="mb-8 mt-2 line-clamp-2 text-sm font-light lg:text-[1rem] lg:font-normal">
                  {description}
                </p>

                <div className="mb-3 mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {stack.slice(0, 4).map((item) => (
                      <span
                        key={`${id}-${item}`}
                        className="rounded-full border border-golden-100/40 px-2 py-1 text-xs text-golden-100/90"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </PinContainer>
            </div>
          )
        )}
      </div>
    </div>
  );
};
