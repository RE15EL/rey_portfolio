import Image from "next/image";

import type { IProject } from "@/modules/projects/domain/project";

type ProjectCardData = Pick<
  IProject,
  "id" | "title" | "description" | "imageUrl" | "stack"
>;

export interface ProjectCardBaseProps {
  project: ProjectCardData;
  className?: string;
  imageSizes?: string;
}

const defaultImageSizes =
  "(max-width: 767px) 92vw, (max-width: 1023px) 384px, 384px";

export const ProjectCardBase = ({
  project,
  className,
  imageSizes = defaultImageSizes,
}: ProjectCardBaseProps) => {
  return (
    <article
      className={[
        "w-full max-w-[22rem] min-w-0 rounded-2xl border border-golden-100/20 bg-dark-100/90 p-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] md:w-96 md:max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid={`project-card-${project.id}`}
    >
      <div className="relative mb-4 w-full min-w-0 overflow-hidden rounded-xl border border-golden-100/10 bg-dark-200/70 aspect-[16/9]">
        <Image
          src={project.imageUrl || "/images/taskmind.png"}
          alt={project.title}
          fill
          sizes={imageSizes}
          className="object-cover"
        />
      </div>

      <h2 className="min-w-0 max-w-full break-words text-base font-bold text-golden-100 md:text-xl lg:text-2xl">
        {project.title}
      </h2>

      <p className="mb-5 mt-2 min-w-0 max-w-full break-words text-sm font-light text-white-200 md:text-base md:font-normal">
        {project.description}
      </p>

      <div className="flex min-w-0 max-w-full flex-wrap gap-2">
        {project.stack.slice(0, 4).map((item) => (
          <span
            key={`${project.id}-${item}`}
            className="max-w-full break-words rounded-full border border-golden-100/40 px-2 py-1 text-xs text-golden-100/90"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
};
