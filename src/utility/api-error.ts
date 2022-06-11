import { HttpStatusCode } from "./http-status-codes";
import { BaseError } from "./error";

export class APIError extends BaseError {
  constructor(
    name: string,
    description = "internal server error",
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true
  ) {
    super(name, description, httpCode, isOperational);
  }
}
