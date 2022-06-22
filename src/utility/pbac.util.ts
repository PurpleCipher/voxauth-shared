import pbac from "pbac";
import { Policy, PolicyEvaluationContext } from "../types";

const PBAC = pbac;

export const evaluate = (
  policy: Policy | Policy[],
  context: PolicyEvaluationContext
): boolean => {
  const policies = Array.isArray(policy) ? policy : [policy];
  const evaluator = new PBAC(policies);
  return evaluator.evaluate(context);
};
