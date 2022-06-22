import { BaseError } from "./error";
import { HttpStatusCode } from "./http-status-codes";
import { APIError } from "./api-error";

describe("Error handling", () => {
  let error: Error;
  let apiError: APIError;

  describe("Base error", () => {
    beforeEach(() => {
      error = new BaseError(
        "error",
        "message",
        HttpStatusCode.BAD_REQUEST,
        false
      );
    });

    it("should return an instance of BaseError", () => {
      expect(error).toBeInstanceOf(BaseError);
    });

    it("should have a message property", () => {
      expect(error.message).toEqual("message");
    });
  });

  describe("Api error", () => {
    beforeEach(() => {
      apiError = new APIError(
        "error",
        "message",
        HttpStatusCode.BAD_REQUEST,
        false
      );
    });

    it("should return an instance of BaseError", () => {
      expect(apiError).toBeInstanceOf(BaseError);
    });

    it("should return an instance of APIError", () => {
      expect(apiError).toBeInstanceOf(APIError);
    });
  });
});
