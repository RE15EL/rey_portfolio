import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "./footer";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const sanitizedProps = { ...props };
    delete sanitizedProps.fill;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...sanitizedProps} alt={sanitizedProps.alt ?? ""} />
    );
  },
}));

vi.mock("./ui", () => ({
  MagicButton: ({ title }: { title: string }) => <button>{title}</button>,
  TypewriterEffect: () => <div>typewriter</div>,
}));

describe("Footer responsive image contract", () => {
  it("defines explicit sizes for fill image", () => {
    render(<Footer />);

    const grid = screen.getByRole("img", { name: "footer grid" });
    expect(grid).toHaveAttribute("sizes", "100vw");
  });
});
