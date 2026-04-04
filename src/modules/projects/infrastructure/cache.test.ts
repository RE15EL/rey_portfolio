import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
}));

import {
  PROJECTS_PUBLISHED_REVALIDATE_SECONDS,
  PROJECTS_PUBLISHED_TAG,
  revalidatePublishedProjectsFeedCache,
} from "./cache";

describe("projects feed cache metadata", () => {
  it("exposes the published projects tag and ttl", () => {
    expect(PROJECTS_PUBLISHED_TAG).toBe("projects:published");
    expect(PROJECTS_PUBLISHED_REVALIDATE_SECONDS).toBe(30);
  });
});

describe("revalidatePublishedProjectsFeedCache", () => {
  it("revalidates the feed tag and home path", () => {
    revalidatePublishedProjectsFeedCache();

    expect(mocks.revalidateTag).toHaveBeenCalledWith("projects:published");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
  });

  it("does not throw when a revalidation primitive fails", () => {
    mocks.revalidateTag.mockImplementation(() => {
      throw new Error("tag failed");
    });
    mocks.revalidatePath.mockImplementation(() => {
      throw new Error("path failed");
    });

    expect(() => revalidatePublishedProjectsFeedCache()).not.toThrow();
  });
});
