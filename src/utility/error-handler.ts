import { Response } from "express";
import { HttpStatusCode } from "./http-status-codes";

export type ErrorType = Record<string, string> | string;

export function respondWithError(
  e: unknown,
  res: Response,
  message: ErrorType = "An unknown error has occurred",
  status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER
): void {
  console.error(e);
  let newMessage: ErrorType = message;
  if (typeof message === "string") {
    newMessage = { error: message };
  }
  res.status(status).json(newMessage);
}
