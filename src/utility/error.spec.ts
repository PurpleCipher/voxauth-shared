import { BaseError } from "./error";
import { HttpStatusCode } from "./http-status-codes";

describe("Error handling", () => {
  let error: Error;

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
});
