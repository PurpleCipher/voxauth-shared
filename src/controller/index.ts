import { Request, Response } from "express";
import { Service } from "../service";

export type Controller<T extends Service> = (service?: T) => {
  handle: (req: Request, res: Response) => Promise<void>;
  parse?: <ParsedType>(
    req: Request,
    key: "body" | "params" | "query" | "headers"
  ) => ParsedType;
  respond: <PayloadType>(
    res: Response,
    status?: number,
    payload?: PayloadType
  ) => void;
};
