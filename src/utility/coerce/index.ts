export const coerceBoolean = (value: any): boolean => {
  if (typeof value === "string") {
    return value === "true";
  }
  return !!value;
};
