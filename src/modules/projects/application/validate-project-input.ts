import { InvalidProjectDataError } from "../domain/errors";

const isValidUrl = (value?: string) => {
  if (!value) {
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
    throw new InvalidProjectDataError("Project URL must be a valid http(s) URL");
  }

  if (!isValidUrl(repoUrl)) {
    throw new InvalidProjectDataError("Repository URL must be a valid http(s) URL");
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
