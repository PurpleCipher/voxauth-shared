import { NextFunction, Request, Response } from "express";
import { HttpStatusCode, PolicyEvaluator } from "../utility";
import { Policy } from "../types";

export const policyMiddleware =
  (
    evaluator: PolicyEvaluator,
    resource: string,
    policy: Policy,
    scopeKey = "action"
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // @ts-ignore
    const { user } = req;

    if (!user) {
      res.status(HttpStatusCode.UNAUTHORIZED);
      return;
    }

    const actionString = user ? user[scopeKey] : "";
    const actions: string[] = actionString.split(" ");
    const isAllowed = actions
      .map((action) => evaluator(policy, { action, resource, context: {} }))
      .every((action) => action);

    if (!isAllowed) {
      res.status(HttpStatusCode.UNAUTHORIZED);
      return;
    }
    next();
  };
