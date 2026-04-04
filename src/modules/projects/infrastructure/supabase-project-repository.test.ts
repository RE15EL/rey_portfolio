import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import {
  ProjectAlreadyExistsError,
  ProjectNotFoundError,
  ProjectUnprocessableDataError,
} from "../domain/errors";
import { SupabaseProjectRepository } from "./supabase-project-repository";

const makeSupabase = (tableBuilder: object) => {
  return {
    from: vi.fn().mockReturnValue(tableBuilder),
  } as unknown as SupabaseClient;
};

describe("SupabaseProjectRepository error translation", () => {
  it("maps create unique violations to ProjectAlreadyExistsError", async () => {
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: "23505",
        message: "duplicate key value violates unique constraint",
        details: "Key (slug)=(demo-project) already exists",
      },
    });
    const tableBuilder = {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single,
        }),
      }),
    };

    const repository = new SupabaseProjectRepository(makeSupabase(tableBuilder));

    await expect(
      repository.create({
        title: "Demo",
        slug: "demo-project",
        description: "Demo",
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectAlreadyExistsError);
  });

  it("maps update invalid payload PG errors to ProjectUnprocessableDataError", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: "23514",
        message: "check violation",
      },
    });
    const tableBuilder = {
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            maybeSingle,
          }),
        }),
      }),
    };

    const repository = new SupabaseProjectRepository(makeSupabase(tableBuilder));

    await expect(
      repository.update({
        id: "project-1",
        slug: "demo-project",
        updatedBy: "admin@example.com",
      })
    ).rejects.toBeInstanceOf(ProjectUnprocessableDataError);
  });

  it("maps delete no-row errors to ProjectNotFoundError", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: "PGRST116",
        message: "JSON object requested, multiple (or no) rows returned",
      },
    });
    const tableBuilder = {
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            maybeSingle,
          }),
        }),
      }),
    };

    const repository = new SupabaseProjectRepository(makeSupabase(tableBuilder));

    await expect(
      repository.delete("project-1", "admin@example.com")
    ).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("returns sanitized ProjectsError for unexpected persistence failures", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: "XX000",
        message: "raw postgres stack trace with schema internals",
      },
    });
    const tableBuilder = {
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            maybeSingle,
          }),
        }),
      }),
    };

    const repository = new SupabaseProjectRepository(makeSupabase(tableBuilder));

    await expect(
      repository.setPublished("project-1", true, "admin@example.com")
    ).rejects.toEqual(
      expect.objectContaining({
        name: "ProjectsError",
        message: "Failed to setPublished project",
      })
    );

    await expect(
      repository.setPublished("project-1", true, "admin@example.com")
    ).rejects.not.toEqual(
      expect.objectContaining({
        message: expect.stringContaining("schema internals"),
      })
    );
  });
});
