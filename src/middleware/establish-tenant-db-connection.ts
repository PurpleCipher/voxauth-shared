import { NextFunction, Request, Response } from "express";
import { DB } from "../utility";

export const setDbConnection =
  (isMultiTenant: boolean, db: DB) =>
  (req: Request, res: Response, next: NextFunction) => {
    let tenantId = req.headers["x-tenant-id"];

    if (!isMultiTenant || !tenantId) {
      tenantId = "default";
    }

    db.openConnection(tenantId as string);
    next();
  };
