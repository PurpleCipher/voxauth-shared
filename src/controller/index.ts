import { Request, Response } from "express";
import { Service } from "../service";

export type Controller<T extends Service> = (service?: T) => {
  handle: (req: Request, res: Response) => Promise<void>;
};
