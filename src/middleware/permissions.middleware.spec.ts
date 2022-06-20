import { Middleware } from "../server";
import { HttpStatusCode } from "../utility";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response, NextFunction } from "express";
import { PermissionConfig, permissions } from "./permissions.middleware";

describe("Permissions Middleware", () => {
  let middleware: Middleware;
  let config: PermissionConfig;
  let req: Request, res: Response, next: NextFunction;

  beforeEach(() => {
    config = { reqProp: "user", permissionProp: "scope" };
    const r = getMockRes();
    res = r.res;
    next = r.next;
  });

  describe("sanity check", () => {
    it("should call res with 403 when no user is provided", () => {
      middleware = permissions(config)("admin");
      req = getMockReq();
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("should call res with 403 when user does not have permission", () => {
    describe("scopes is a string", () => {
      beforeEach(() => {
        middleware = permissions(config)("admin");
      });

      it("scope is an undefined", () => {
        req = getMockReq({ user: { scope: undefined } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });

      it("scope is an empty string", () => {
        req = getMockReq({ user: { scope: "" } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });

      it("scope is an empty array", () => {
        req = getMockReq({ user: { scope: [] } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });
      describe("scope does not have correct permission", () => {
        it("scope is string", () => {
          req = getMockReq({ user: { scope: "tenant:read" } });
          middleware(req, res, next);
          expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
          expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
          expect(next).not.toHaveBeenCalled();
        });

        it("scope is an array", () => {
          req = getMockReq({ user: { scope: ["tenant:read"] } });
          middleware(req, res, next);
          expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
          expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
          expect(next).not.toHaveBeenCalled();
        });
      });
    });
    describe("scopes is an array", () => {
      beforeEach(() => {
        middleware = permissions(config)(["admin"]);
      });

      it("scope not in array", () => {
        req = getMockReq({ user: { scope: "tenant:write" } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });

      it("scope not in array", () => {
        req = getMockReq({ user: { scope: ["tenant:write", "tenant:read"] } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });

      it("all required scopes not in array", () => {
        middleware = permissions(config)(["tenant:write", "tenant:read"]);
        req = getMockReq({ user: { scope: ["tenant:write"] } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });

      it("all required scopes not in array of scope", () => {
        middleware = permissions(config)([
          ["tenant:write", "tenant:read"],
          ["admin"],
        ]);
        req = getMockReq({ user: { scope: ["tenant:read"] } });
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
      });
    });
  });

  describe("should call next when user has permission", () => {
    it("scope is in array", () => {
      middleware = permissions(config)(["tenant:write"]);
      req = getMockReq({ user: { scope: "tenant:write" } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("scope is in string", () => {
      middleware = permissions(config)("tenant:write");
      req = getMockReq({ user: { scope: "tenant:write" } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    describe("has one or more required scopes", () => {
      it("scope is in string", () => {
        middleware = permissions(config)([["tenant:write"], ["tenant:read"]]);
        req = getMockReq({ user: { scope: "tenant:write" } });
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it("scope is in array", () => {
        middleware = permissions(config)([
          ["tenant:write", "tenant:read"],
          ["admin"],
        ]);
        req = getMockReq({ user: { scope: ["admin"] } });
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
