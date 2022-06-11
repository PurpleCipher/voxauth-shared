import { Application } from "express";

export type ServerType = Application;

type BaseServerConfig = {
  port: number;
  cb?: (...args: unknown[]) => void;
};
export type ExpressServerConfig = {};
export type ServerConfig = BaseServerConfig & ExpressServerConfig;

export interface IServer {
  app: ServerType;
  config: ServerConfig;
  // setupMiddlewares?: () => void;
  // setupRoutes(): void;
  listen(cb: (...args: unknown[]) => void): Promise<void>;
}

export abstract class BaseServer implements Pick<IServer, "config"> {
  config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
  }
}
