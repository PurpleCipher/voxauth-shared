import { Request, Response } from "express";
import { InitService, Service } from "../service";

export type Handler = (req: Request, res: Response) => Promise<void>;

export type Controller<T extends Service> = (service?: T) => {
  handle: Handler;
  parse?: <ParsedType>(
    req: Request,
    key: "body" | "params" | "query" | "headers"
  ) => ParsedType;
};

type IInitService = Service & InitService;

export const initServiceControllerWrapper = async <T extends IInitService>(
  service: T,
  controller: Controller<T>,
  isMultiTenant: boolean = false,
  tenantId?: string
): Promise<Handler> => {
  await service.init(isMultiTenant, tenantId);
  return controller(service).handle;
};
