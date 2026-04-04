import { render, screen, within } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import type { IProject } from "@/modules/projects/domain/project";

import { ProjectCardBase } from "./project-card-base";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

const project: IProject = {
  id: "project-1",
  slug: "project-1",
  title: "Proyecto con título bastante extenso para mobile",
  description:
    "Descripción larga para verificar wraps y evitar overflow horizontal en resoluciones chicas.",
  stack: ["Next.js", "TypeScript", "Tailwind", "Supabase", "Vitest"],
  imageUrl: null,
  projectUrl: null,
  repoUrl: null,
  isPublished: true,
  sortOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  updatedBy: null,
};

const shortProject: IProject = {
  ...project,
  id: "project-short",
  slug: "project-short",
  title: "Card corta",
  description: "Texto corto",
  stack: ["Next.js", "TypeScript"],
};

const longProject: IProject = {
  ...project,
  id: "project-long",
  slug: "project-long",
  title:
    "Card extremadamente larga para validar contrato de sizing estable en mobile sin clipping",
  description:
    "Descripción muy extensa para comprobar que el contenido crece de forma natural, sin truncarse fuera del contenedor, manteniendo el flujo de layout estable y sin depender de alturas rígidas en viewport.",
  stack: [
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "Supabase",
    "Vitest",
    "Testing Library",
    "Responsive Contract",
  ],
};

describe("ProjectCardBase", () => {
  it("renders shared content and fallback image with explicit sizes", () => {
    render(<ProjectCardBase project={project} />);

    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();

    const image = screen.getByRole("img", { name: project.title });
    expect(image).toHaveAttribute("src", "/images/taskmind.png");
    expect(image).toHaveAttribute(
      "sizes",
      "(max-width: 767px) 92vw, (max-width: 1023px) 384px, 384px"
    );
  });

  it("keeps responsive guard classes for width and wrapping", () => {
    const { container } = render(<ProjectCardBase project={project} />);

    const card = container.querySelector("article");
    expect(card).toHaveClass("min-w-0");
    expect(card).toHaveClass("max-w-[22rem]");

    const title = card?.querySelector("h2") as HTMLElement | null;
    expect(title).not.toBeNull();
    expect(title).toHaveClass("break-words");
  });

  it("spec scenario: stable card sizing contract avoids rigid viewport-height dependency", () => {
    const { container } = render(<ProjectCardBase project={project} />);

    const card = container.querySelector("article");
    expect(card).not.toBeNull();
    expect(card).toHaveClass("w-full");
    expect(card).toHaveClass("max-w-[22rem]");
    expect(card?.className).not.toContain("vh");
    expect(card?.className).not.toContain("h-[20vh]");
    expect(card?.className).not.toContain("h-[24rem]");

    const media = card?.querySelector("div");
    expect(media).not.toBeNull();
    expect(media).toHaveClass("aspect-[16/9]");
    expect(media?.className).not.toContain("vh");
  });

  it("spec scenario: mixed content lengths keep bounded widths and media proportions", () => {
    const { container } = render(
      <>
        <ProjectCardBase project={shortProject} />
        <ProjectCardBase project={longProject} />
      </>
    );

    const cards = container.querySelectorAll("article");
    expect(cards).toHaveLength(2);

    cards.forEach((card) => {
      expect(card).toHaveClass("w-full");
      expect(card).toHaveClass("max-w-[22rem]");
      expect(card).toHaveClass("min-w-0");

      const media = card.querySelector("div");
      expect(media).not.toBeNull();
      expect(media).toHaveClass("aspect-[16/9]");
    });
  });

  it("spec scenario: truncation and wrapping guards are preserved for long text and tags", () => {
    const { container } = render(<ProjectCardBase project={longProject} />);

    const card = container.querySelector(
      '[data-testid="project-card-project-long"]'
    ) as HTMLElement | null;
    if (!card) {
      throw new Error("Expected long project card to be rendered");
    }

    const cardScope = within(card);

    const title = cardScope.getByText(longProject.title);
    expect(title).toHaveClass("break-words");
    expect(title).toHaveClass("max-w-full");

    const description = cardScope.getByText(longProject.description);
    expect(description).toHaveClass("break-words");
    expect(description).toHaveClass("max-w-full");

    const tagsContainer = card.querySelector("div.flex");
    expect(tagsContainer).not.toBeNull();
    expect(tagsContainer).toHaveClass("flex-wrap");

    const renderedTags = cardScope.getAllByText(
      /Next.js|TypeScript|TailwindCSS|Supabase/
    );
    expect(renderedTags).toHaveLength(4);
    renderedTags.forEach((tag) => {
      expect(tag).toHaveClass("max-w-full");
      expect(tag).toHaveClass("break-words");
    });
  });
});
