import { validate } from "./validate";
import Joi from "joi";
jest.mock("joi");

describe("Validate Fn", () => {
  let schema: Joi.Schema = {} as any as Joi.Schema;
  let payload: Record<string, unknown>;

  beforeEach(() => {
    schema = {
      validate: jest.fn(),
      validateAsync: jest.fn(),
    } as any as Joi.Schema;
  });

  it("should call validate on schema with payload", () => {
    payload = {};
    schema.validate = jest.fn().mockReturnValue({ error: undefined });
    validate(schema, payload);
    expect(schema.validate).toBeCalledWith(payload);
  });

  it("should return promise when isAsync flag is passed", () => {
    payload = {};
    schema.validateAsync = jest.fn().mockResolvedValue({ error: undefined });
    validate(schema, payload, true);
    expect(schema.validateAsync).toBeCalledWith(payload);
  });
});
