import { Middleware } from "../server";
import { hasTenantId } from "./has-tenant-id.middleware";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("Has Tenant ID Middleware", () => {
  let middleware: Middleware;

  it("should return a middleware", () => {
    middleware = hasTenantId("tenantId");
    expect(middleware).toBeInstanceOf(Function);
  });

  it("should call res with status 500 when keyId is empty", () => {
    middleware = hasTenantId("");
    const req = getMockReq();
    const { res, next } = getMockRes();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while trying to get your configurations",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call res with 400 when tenant id is not provided", () => {
    middleware = hasTenantId("x-tenant-id");
    const req = getMockReq();
    const { res, next } = getMockRes();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Tenant ID is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when tenant id is provided", () => {
    middleware = hasTenantId("x-tenant-id");
    const req = getMockReq({
      headers: {
        "x-tenant-id": "123",
      },
    });
    const { res, next } = getMockRes();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
