import { Middleware } from "../server";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { InitService } from "../service";
import { initServiceMiddleware } from "./init-service.middleware";
import { Request } from "express";
import { HttpStatusCode } from "../utility";
describe("InitServiceMiddleware", () => {
  let middleware: Middleware;
  let service: InitService;
  let req: Request;
  let res = getMockRes().res;
  let next = getMockRes().next;

  it("should return a middleware", () => {
    middleware = initServiceMiddleware(service);
    expect(middleware).toBeInstanceOf(Function);
  });

  describe("when tenant id is not provided", () => {
    beforeEach(() => {
      req = getMockReq({
        headers: {
          "x-tenant-id": undefined,
        },
      });
      service = {
        init: jest.fn(),
      };
      middleware = initServiceMiddleware({
        init: jest.fn(),
      });
      middleware(req, res, next);
    });

    it("should not call init on service", () => {
      expect(service.init).not.toHaveBeenCalled();
    });

    it("should call res with status 400", () => {
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
    });

    it("should call res with error message", () => {
      expect(res.json).toHaveBeenCalledWith({ error: "No tenant id provided" });
    });
  });

  describe("when tenant id is provided", () => {
    describe("when init fails", () => {
      beforeEach(() => {
        req = getMockReq({
          headers: {
            "x-tenant-id": "123",
          },
        });
        service = {
          init: jest.fn().mockRejectedValue(new Error("error")),
        };
        middleware = initServiceMiddleware(service);
        middleware(req, res, next);
      });

      it("should call init on service", () => {
        expect(service.init).toHaveBeenCalled();
      });

      it("should call res with status 500", () => {
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER);
      });

      it("should call res with error message", () => {
        expect(res.json).toHaveBeenCalledWith({ error: "error" });
      });
    });

    describe("when init succeeds", () => {
      describe("for single tenant", () => {
        beforeEach(() => {
          req = getMockReq({
            headers: {
              "x-tenant-id": "123",
            },
          });
          service = {
            init: jest.fn().mockResolvedValue(undefined),
          };
          middleware = initServiceMiddleware(service);
          middleware(req, res, next);
        });
        it("should call init on service", () => {
          expect(service.init).toHaveBeenCalledWith(false, "123");
        });

        it("should call next", () => {
          expect(next).toHaveBeenCalled();
        });
      });
      describe("for multi tenant", () => {
        beforeEach(() => {
          req = getMockReq({
            headers: {
              "x-tenant-id": "123",
            },
          });
          service = {
            init: jest.fn().mockResolvedValue(undefined),
          };
          middleware = initServiceMiddleware(service, true);
          middleware(req, res, next);
        });
        it("should call init on service", () => {
          expect(service.init).toHaveBeenCalledWith(true, "123");
        });
      });
    });
  });
});
