import express, { Application, NextFunction, Router } from "express";

export type ServerType = Application;

type BaseServerConfig = {
  port: number;
  cb?: (...args: unknown[]) => void;
};
export type ExpressServerConfig = {};
export type ServerConfig = BaseServerConfig & ExpressServerConfig;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
export type Route = {
  handler: (router: Router, middlewares: Middleware[]) => Router;
  middlewares: Middleware[];
};

export interface IServer {
  app: ServerType;
  config: ServerConfig;
  router: Router;

  // setupMiddlewares?: () => void;
  setupRoutes(routes: Route[]): void;

  listen(cb: (...args: unknown[]) => void): Promise<void>;
}

export abstract class BaseServer
  implements Pick<IServer, "app" | "config" | "router">
{
  app: ServerType = express();

  router: Router = express.Router();

  config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
  }
}
