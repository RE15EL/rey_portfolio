import {
  InvalidProjectDataError,
  ProjectAlreadyExistsError,
  ProjectNotFoundError,
} from "../domain/errors";

export const mapProjectErrorToHttp = (error: unknown) => {
  if (error instanceof InvalidProjectDataError) {
    return { status: 400, message: error.message };
  }

  if (error instanceof ProjectAlreadyExistsError) {
    return { status: 409, message: error.message };
  }

  if (error instanceof ProjectNotFoundError) {
    return { status: 404, message: error.message };
  }

  return { status: 500, message: "Unexpected server error" };
};
