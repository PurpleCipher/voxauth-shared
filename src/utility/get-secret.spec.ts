import { getSecretFromDapr } from "./get-secret";
import axios, { AxiosError, AxiosResponse } from "axios";

jest.mock("axios");

describe("Get secrets", () => {
  let thenFn = jest.fn();
  let catchFn = jest.fn();
  let result: unknown;

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe("When call to store fails", () => {
    beforeEach(async () => {
      axios.get = jest.fn().mockRejectedValue({} as AxiosError);
      await getSecretFromDapr
        .getSecret(3000, "mongodb", "user-cred")
        .then(thenFn)
        .catch(catchFn);
    });
    it("should call axios", () => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3000/v1.0/secrets/mongodb/user-cred"
      );
    });
    it("should not call the then fn", () => {
      expect(thenFn).not.toBeCalled();
    });
    it("should throw error", () => {
      expect(catchFn).toBeCalled();
    });
  });

  describe("When calls succeed", () => {
    describe("Called without a mapper", () => {
      beforeEach(async () => {
        axios.get = jest.fn().mockResolvedValue({});
        result = await getSecretFromDapr.getSecret(
          3000,
          "mongodb",
          "user-cred"
        );
      });
      it("should respond with instance of AxiosResponse", () => {
        expect(result).toEqual({});
      });
      it("should be called once", () => {
        expect(axios.get).toBeCalledTimes(1);
      });
    });
    describe("Called with a mapper", () => {
      let mapper: jest.Mock = jest.fn().mockReturnValue({ mocked: true });
      beforeEach(async () => {
        axios.get = jest.fn().mockResolvedValue({});
        result = await getSecretFromDapr.getSecret(
          3000,
          "mongodb",
          "user-cred",
          undefined,
          mapper
        );
      });
      it("should respond with instance of AxiosResponse", () => {
        expect(result).toEqual({ mocked: true });
      });
      it("should be called once", () => {
        expect(axios.get).toBeCalledTimes(1);
      });
    });

    describe("Retry", () => {
      let mapper: jest.Mock = jest.fn().mockReturnValue({ mocked: true });
      beforeEach(async () => {
        axios.get = jest
          .fn()
          .mockRejectedValueOnce({} as AxiosError)
          .mockResolvedValue({});
        result = await getSecretFromDapr.getSecret(
          3000,
          "mongodb",
          "user-cred",
          { maxRetries: 2 },
          mapper
        );
      });
      it("should be called twice", () => {
        expect(axios.get).toBeCalledTimes(2);
      });
    });
  });
});
