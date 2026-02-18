export class ProjectsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectsError";
  }
}

export class InvalidProjectDataError extends ProjectsError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProjectDataError";
  }
}

export class ProjectAlreadyExistsError extends ProjectsError {
  constructor(slug: string) {
    super(`Project with slug '${slug}' already exists`);
    this.name = "ProjectAlreadyExistsError";
  }
}

export class ProjectNotFoundError extends ProjectsError {
  constructor(id: string) {
    super(`Project with id '${id}' was not found`);
    this.name = "ProjectNotFoundError";
  }
}
