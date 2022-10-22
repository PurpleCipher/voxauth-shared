import { NextFunction, Request, Response } from "express";
import { InitService } from "../service";
import { HttpStatusCode } from "../utility";

export const initServiceMiddleware =
  (service: InitService, isMultiTenant = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.headers["x-tenant-id"] as string | undefined;

    if (!tenantId) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "No tenant id provided" });
      return;
    }

    try {
      await service.init(isMultiTenant, tenantId);
      next();
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json({
        error: (e as Error).message,
      });
    }
  };
