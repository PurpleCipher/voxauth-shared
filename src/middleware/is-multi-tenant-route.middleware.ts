import { Request, Response, NextFunction } from "express";

export const hasTenantId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["x-tenant-id"]) {
    next();
    return;
  }
  res.status(401).json({ error: "Tenant ID is required" });
};
