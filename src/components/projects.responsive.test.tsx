import { cleanup, render, screen, within } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { IProject } from "@/modules/projects/domain/project";

import { RecentProjects } from "./projects";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

vi.mock("./ui", () => ({
  PinContainer: ({
    children,
    title,
    href,
  }: {
    children: ReactNode;
    title: string;
    href: string;
  }) => (
    <div data-testid="pin-container" data-title={title} data-href={href}>
      {children}
    </div>
  ),
}));

const projects: IProject[] = [
  {
    id: "project-1",
    slug: "project-1",
    title: "Proyecto 1",
    description: "Descripción del proyecto 1",
    stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    imageUrl: null,
    projectUrl: "https://example.com/project-1",
    repoUrl: "https://github.com/example/project-1",
    isPublished: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: null,
  },
];

describe("RecentProjects responsive contract", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders both responsive wrappers with shared content source", () => {
    const { container } = render(<RecentProjects projects={projects} />);

    expect(screen.getByTestId("project-mobile-wrapper")).toHaveClass("md:hidden");
    expect(screen.getByTestId("project-desktop-wrapper")).toHaveClass("hidden");
    expect(screen.getByTestId("pin-container")).toBeInTheDocument();

    const cards = container.querySelectorAll('[data-testid="project-card-project-1"]');
    expect(cards).toHaveLength(2);

    const mobileCard = within(screen.getByTestId("project-mobile-wrapper"));
    expect(mobileCard.getByText("Proyecto 1")).toBeInTheDocument();
  });

  it("spec scenario: mobile uses non-3D wrapper while desktop uses 3D wrapper", () => {
    render(<RecentProjects projects={projects} />);

    const mobileWrapper = screen.getByTestId("project-mobile-wrapper");
    const desktopWrapper = screen.getByTestId("project-desktop-wrapper");

    expect(mobileWrapper).toHaveClass("md:hidden");
    expect(desktopWrapper).toHaveClass("hidden");
    expect(desktopWrapper).toHaveClass("md:block");

    expect(within(mobileWrapper).queryByTestId("pin-container")).toBeNull();
    expect(within(desktopWrapper).getByTestId("pin-container")).toBeInTheDocument();
  });

  it("spec scenario: desktop and mobile branches share same content contract", () => {
    const { container } = render(<RecentProjects projects={projects} />);

    const mobileWrapper = screen.getByTestId("project-mobile-wrapper");
    const desktopWrapper = screen.getByTestId("project-desktop-wrapper");

    const mobileScoped = within(mobileWrapper);
    const desktopScoped = within(desktopWrapper);

    expect(mobileScoped.getByText("Proyecto 1")).toBeInTheDocument();
    expect(desktopScoped.getByText("Proyecto 1")).toBeInTheDocument();
    expect(mobileScoped.getByText("Descripción del proyecto 1")).toBeInTheDocument();
    expect(desktopScoped.getByText("Descripción del proyecto 1")).toBeInTheDocument();
    expect(mobileScoped.getByText("Next.js")).toBeInTheDocument();
    expect(desktopScoped.getByText("Next.js")).toBeInTheDocument();

    const cards = container.querySelectorAll('[data-testid="project-card-project-1"]');
    expect(cards).toHaveLength(2);

    const desktopPin = desktopScoped.getByTestId("pin-container");
    expect(desktopPin).toHaveAttribute("data-title", "Proyecto 1");
    expect(desktopPin).toHaveAttribute("data-href", "https://example.com/project-1");
  });

  it("keeps overflow guard contract for target mobile widths", () => {
    const widths = [360, 390, 414, 441];

    widths.forEach((width) => {
      vi.stubGlobal("innerWidth", width);
      const { getByTestId, unmount } = render(<RecentProjects projects={projects} />);

      const overflowGuard = getByTestId("projects-overflow-guard");
      expect(overflowGuard).toHaveClass("overflow-x-clip");

      const grid = getByTestId("projects-grid");
      expect(grid.className).not.toContain("h-[20vh]");
      expect(grid.className).not.toContain("h-[24rem]");

      unmount();
    });
  });

  it("preserves projects/footer responsive contract across breakpoint matrix", () => {
    const widths = [320, 360, 390, 414, 430, 480, 640, 1024, 1280];

    widths.forEach((width) => {
      vi.stubGlobal("innerWidth", width);
      const { getByTestId, getByText, unmount } = render(
        <RecentProjects projects={projects} />
      );

      expect(getByText("Mis Proyectos")).toBeInTheDocument();
      expect(getByTestId("project-mobile-wrapper")).toBeInTheDocument();
      expect(getByTestId("project-desktop-wrapper")).toBeInTheDocument();

      unmount();
    });
  });
});
