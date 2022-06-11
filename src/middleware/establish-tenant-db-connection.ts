import { NextFunction, Request, Response } from "express";
import { DB } from "../utility";

export const setDbConnection =
  (db: DB) => (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.headers["x-tenant-id"];
    if (!tenantId) {
      res.status(401).json({ error: "Tenant ID is required" });
      return;
    }
    db.openConnection(tenantId as string);
    next();
  };
