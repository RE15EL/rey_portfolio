import { revalidatePath, revalidateTag } from "next/cache";

export const PROJECTS_PUBLISHED_TAG = "projects:published";
export const PROJECTS_PUBLISHED_REVALIDATE_SECONDS = 30;

export const revalidatePublishedProjectsFeedCache = () => {
  try {
    revalidateTag(PROJECTS_PUBLISHED_TAG);
  } catch (error) {
    console.error("Failed to revalidate published projects tag", error);
  }

  try {
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to revalidate home path", error);
  }
};
