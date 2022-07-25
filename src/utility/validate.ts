import Joi from "joi";

type ValidateFn = (
  schema: Joi.Schema,
  payload: Record<string, unknown>,
  isAsync?: boolean
) => boolean | Promise<boolean>;
type ValidateWithResult = (
  schema: Joi.Schema,
  payload: Record<string, unknown>,
  isAsync?: boolean
) => Joi.ValidationResult | Promise<Joi.ValidationResult>;

export type Validator = ValidateFn | ValidateWithResult;

export const validate: Validator = (
  schema: Joi.Schema,
  payload: Record<string, unknown>,
  isAsync = false
): boolean | Promise<boolean> => {
  if (!isAsync) {
    const result = schema.validate(payload);
    return !result.error;
  }
  return schema.validateAsync(payload).then((result) => !result.error);
};
