import {
  InvalidProjectDataError,
  ProjectUnprocessableDataError,
} from "../domain/errors";

const projectSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_SORT_ORDER = 0;
const MAX_SORT_ORDER = 9999;

const isValidUrl = (value?: string) => {
  if (!value?.trim()) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const ensureValidTitle = (title: string) => {
  if (!title?.trim()) {
    throw new InvalidProjectDataError("Title is required");
  }
};

export const ensureValidDescription = (description: string) => {
  if (!description?.trim()) {
    throw new InvalidProjectDataError("Description is required");
  }
};

export const ensureValidLinks = (projectUrl?: string, repoUrl?: string) => {
  if (!isValidUrl(projectUrl)) {
    throw new ProjectUnprocessableDataError(
      "Project URL must be a valid http(s) URL"
    );
  }

  if (!isValidUrl(repoUrl)) {
    throw new ProjectUnprocessableDataError(
      "Repository URL must be a valid http(s) URL"
    );
  }
};

export const ensureValidSlug = (slug: string) => {
  if (!projectSlugPattern.test(slug)) {
    throw new ProjectUnprocessableDataError(
      "Slug must contain lowercase letters, numbers and hyphens"
    );
  }
};

export const ensureValidSortOrder = (sortOrder: number) => {
  if (!Number.isSafeInteger(sortOrder)) {
    throw new ProjectUnprocessableDataError("sortOrder must be a safe integer");
  }

  if (sortOrder < MIN_SORT_ORDER || sortOrder > MAX_SORT_ORDER) {
    throw new ProjectUnprocessableDataError(
      `sortOrder must be between ${MIN_SORT_ORDER} and ${MAX_SORT_ORDER}`
    );
  }
};

export const normalizeStack = (stack?: string[]) => {
  if (!stack) {
    return [];
  }

  return stack
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
};
