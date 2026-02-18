import type {
  ICreateProjectInput,
  IProject,
  IUpdateProjectInput,
} from "./project";

export interface IProjectRepository {
  listPublished(): Promise<IProject[]>;
  listAdmin(): Promise<IProject[]>;
  getById(id: string): Promise<IProject | null>;
  getBySlug(slug: string): Promise<IProject | null>;
  create(input: ICreateProjectInput): Promise<IProject>;
  update(input: IUpdateProjectInput): Promise<IProject>;
  setPublished(id: string, isPublished: boolean, updatedBy: string): Promise<IProject>;
}
