import { respondWithError } from "./error-handler";
import { getMockRes } from "@jest-mock/express";
import { Response } from "express";
import { HttpStatusCode } from "./http-status-codes";

describe("Error handler", () => {
  const res: Response = getMockRes().res;

  beforeEach(() => {
    console.error = jest.fn();
  });

  it("should respond error string when message is undefined", () => {
    respondWithError("error", res);
    expect(res.json).toBeCalledWith({
      error: "An unknown error has occurred",
    });
  });

  it("should respond error string when message is a string", () => {
    respondWithError("error", res, "This is an error");
    expect(res.json).toBeCalledWith({
      error: "This is an error",
    });
  });

  it("should respond with custom error", () => {
    const message = {
      error: "foo",
      reason: "bar",
    };
    respondWithError("error", res, message);
    expect(res.json).toBeCalledWith(message);
  });

  it("should log error", () => {
    const message = {
      error: "foo",
      reason: "bar",
    };
    respondWithError("error", res, message);
    expect(console.error).toBeCalledWith("error");
  });

  it("should respond with 500 when status is undefined", () => {
    const message = {
      error: "foo",
      reason: "bar",
    };
    respondWithError("error", res, message);
    expect(res.status).toBeCalledWith(HttpStatusCode.INTERNAL_SERVER);
  });

  it("should respond with correct status code", () => {
    const message = {
      error: "foo",
      reason: "bar",
    };
    respondWithError("error", res, message, HttpStatusCode.NOT_FOUND);
    expect(res.status).toBeCalledWith(HttpStatusCode.NOT_FOUND);
  });
});
