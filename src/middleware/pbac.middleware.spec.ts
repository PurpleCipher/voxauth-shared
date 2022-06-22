import { Middleware } from "../server";
import { HttpStatusCode, PolicyEvaluator } from "../utility";
import { policyMiddleware } from "./pbac.middleware";
import { NextFunction, Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Policy } from "../types";

describe("Policy evaluation middleware", () => {
  let middleware: Middleware;
  let evaluator: PolicyEvaluator;
  let req: Request, res: Response, next: NextFunction;
  let policy: Policy;
  const resource = "test-resource";

  beforeEach(() => {
    const r = getMockRes();
    res = r.res;
    next = r.next;
    policy = {} as Policy;
  });

  describe("when called without actions in req", () => {
    beforeEach(() => {
      evaluator = jest.fn();
      middleware = policyMiddleware(evaluator, resource, policy);
      req = getMockReq();
      middleware(req, res, next);
    });

    it("should not call evaluator", () => {
      expect(evaluator).not.toBeCalled();
    });

    it("should not call next", () => {
      expect(next).not.toBeCalled();
    });

    it("should call res with unauthorized status code", () => {
      expect(res.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe("when called with actions in req", () => {
    describe("actions do not evaluate to true", () => {
      describe("all conditions are invalid", () => {
        beforeEach(() => {
          evaluator = jest
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValue(false);
          middleware = policyMiddleware(evaluator, resource, policy);
          req = getMockReq({
            user: {
              action: "create update",
            },
          });
          middleware(req, res, next);
        });

        it("should call evaluator 2 times", () => {
          expect(evaluator).toBeCalledTimes(2);
        });

        it("should call res with unauthorized", () => {
          expect(res.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
        });
      });

      describe("one condition is invalid", () => {
        beforeEach(() => {
          evaluator = jest
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValue(true);
          middleware = policyMiddleware(evaluator, resource, policy);
          req = getMockReq({
            user: {
              action: "create update",
            },
          });
          middleware(req, res, next);
        });

        it("should call evaluator 2 times", () => {
          expect(evaluator).toBeCalledTimes(2);
        });

        it("should call res with unauthorized", () => {
          expect(res.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
        });
      });
    });

    describe("actions evaluate to true", () => {
      beforeEach(() => {
        evaluator = jest.fn().mockReturnValue(true);
        middleware = policyMiddleware(evaluator, resource, policy);
        req = getMockReq({
          user: {
            action: "create update",
          },
        });
        middleware(req, res, next);
      });
      it("should call next", () => {
        expect(next).toBeCalled();
      });
    });
  });
});
