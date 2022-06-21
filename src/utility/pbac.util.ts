import * as PBAC from "pbac";
import { Policy, PolicyEvaluationContext } from "../types";

export const evaluate = (
  policy: Policy | Policy[],
  context: PolicyEvaluationContext
): boolean => {
  const policies = Array.isArray(policy) ? policy : [policy];
  const pbac = new PBAC(policies);
  return pbac.evaluate(context);
};
