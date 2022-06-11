import { HttpStatusCode } from "./http-status-codes";

export class BaseError extends Error {
  public readonly name: string;

  public readonly httpCode: HttpStatusCode;

  public readonly isOperational: boolean;

  constructor(
    name: string,
    description: string,
    httpCode: HttpStatusCode,
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
