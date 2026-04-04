import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminProjectForm } from "./admin-project-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("AdminProjectForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows actionable message when API returns conflict", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: "Project with slug 'demo-project' already exists" }),
      })
    );

    render(<AdminProjectForm mode="create" />);

    const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
    const descriptionInput = document.querySelector<HTMLTextAreaElement>(
      'textarea[name="description"]'
    );

    expect(titleInput).not.toBeNull();
    expect(descriptionInput).not.toBeNull();

    if (!titleInput || !descriptionInput) {
      throw new Error("Expected title and description fields to exist");
    }

    await user.type(titleInput, "Demo Project");
    await user.type(descriptionInput, "Demo description");
    await user.click(screen.getByRole("button", { name: "Crear proyecto" }));

    await waitFor(() => {
      expect(
        screen.getByText("Ya existe un proyecto con ese slug. Probá con otro slug o título.")
      ).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
