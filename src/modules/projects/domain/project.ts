export interface IProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  stack: string[];
  imageUrl: string | null;
  projectUrl: string | null;
  repoUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface ICreateProjectInput {
  slug?: string;
  title: string;
  description: string;
  stack?: string[];
  imageUrl?: string;
  projectUrl?: string;
  repoUrl?: string;
  isPublished?: boolean;
  sortOrder?: number;
  updatedBy: string;
}

export interface IUpdateProjectInput {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  stack?: string[];
  imageUrl?: string;
  projectUrl?: string;
  repoUrl?: string;
  sortOrder?: number;
  updatedBy: string;
}
