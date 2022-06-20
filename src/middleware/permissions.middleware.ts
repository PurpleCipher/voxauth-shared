import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../utility";

export type PermissionConfig = { reqProp: string; permissionProp: string };

export const permissions =
  (config: PermissionConfig) =>
  (scopes: string | string[] | string[][]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parseScopes = (innerScopes: string | string[] | any) => {
      if (typeof innerScopes === "string") {
        return [innerScopes.split(" ")];
      }
      if (
        Array.isArray(innerScopes) &&
        innerScopes.every((s) => typeof s === "string")
      ) {
        return [innerScopes];
      }
      return innerScopes as string[][];
    };
    const parsedScopes = parseScopes(scopes);
    const unauthorized = () => {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Forbidden" });
    };
    const { reqProp, permissionProp } = config;
    // @ts-ignore
    const user = req[reqProp];
    let scopesArray: string[];
    if (!user) {
      return unauthorized();
    }
    const rawUserScopes = user[permissionProp];
    const isEmptyArray =
      !!rawUserScopes &&
      Array.isArray(rawUserScopes) &&
      rawUserScopes.length === 0;
    if (!rawUserScopes || isEmptyArray) {
      return unauthorized();
    }

    if (typeof rawUserScopes === "string") {
      scopesArray = [...rawUserScopes.split(" ")];
    } else {
      scopesArray = [...rawUserScopes];
    }

    const hasPermission = parsedScopes.some((s) =>
      s.every((scope) => scopesArray.includes(scope))
    );

    if (!hasPermission) {
      return unauthorized();
    }

    return next();
  };
