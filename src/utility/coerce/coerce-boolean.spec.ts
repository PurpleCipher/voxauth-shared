import { coerceBoolean } from "./index";
describe("coerceBoolean", () => {
  it("should return true for true", () => {
    expect(coerceBoolean(true)).toBe(true);
  });

  it("should return false for false", () => {
    expect(coerceBoolean(false)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(coerceBoolean(undefined)).toBe(false);
  });

  it("should return false for null", () => {
    expect(coerceBoolean(null)).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(coerceBoolean("")).toBe(false);
  });

  it("should return true for empty object", () => {
    expect(coerceBoolean({})).toBe(true);
  });

  it("should return true for empty array", () => {
    expect(coerceBoolean([])).toBe(true);
  });

  it('should return false for "0"', () => {
    expect(coerceBoolean(0)).toBe(false);
  });

  it("should return true for non-zero number", () => {
    expect(coerceBoolean(1)).toBe(true);
    expect(coerceBoolean(-1)).toBe(true);
  });
});
