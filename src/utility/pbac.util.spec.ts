import { evaluate } from "./pbac.util";
// @ts-ignore
import pbac from "pbac";
import { Policy, PolicyEvaluationContext } from "../types";
jest.createMockFromModule("pbac");
jest.mock("pbac");

const pbacMock = {
  evaluate: jest.fn(),
};

describe("PBAC Util", () => {
  let policy: Policy | Policy[];
  let context: PolicyEvaluationContext;

  beforeEach(() => {
    pbac.mockImplementation(() => pbacMock);
  });

  it("should call evaluate", () => {
    policy = {} as Policy;
    context = {} as PolicyEvaluationContext;
    evaluate(policy, context);
    expect(pbacMock.evaluate).toHaveBeenCalledTimes(1);
  });

  it("should call evaluate", () => {
    policy = [];
    context = {} as PolicyEvaluationContext;
    evaluate(policy, context);
    expect(pbacMock.evaluate).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
