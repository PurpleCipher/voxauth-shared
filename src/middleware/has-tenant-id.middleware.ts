import { Request, Response, NextFunction } from "express";
import { Middleware } from "../server";

export const hasTenantId: (idKey: string) => Middleware =
  (idKey: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!idKey) {
      res.status(500).json({
        error: "An error occurred while trying to get your configurations",
      });
      return;
    }

    const tenantId = req.headers[idKey];

    if (!tenantId) {
      res.status(400).json({ error: "Tenant ID is required" });
      return;
    }

    next();
  };
