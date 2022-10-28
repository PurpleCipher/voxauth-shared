import { NextFunction, Request, Response } from "express";
import { InitService } from "../service";
import { HttpStatusCode } from "../utility";
import { Middleware } from "../server";

export const initServiceMiddleware: (
  service: InitService,
  isMultiTenant?: boolean
) => Middleware =
  (service: InitService, isMultiTenant = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = (req.headers["x-tenant-id"] as string) ?? "default";

    try {
      await service.init(isMultiTenant, tenantId);
      next();
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json({
        error: (e as Error).message,
      });
    }
  };
