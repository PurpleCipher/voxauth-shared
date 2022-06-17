import express, {
  Application,
  NextFunction,
  Router,
  Request,
  Response,
} from "express";
import { DB, DBConfig, LogConfig, setupLogging } from "../utility";

export type ServerType = Application;

type BaseServerConfig = {
  port: number;
  cb?: (...args: unknown[]) => void;
  globalErrorHandler?: () => void;
  loggingConfig?: LogConfig;
  logPath?: string;
  errorLogPath?: string;
  dbConfig?: DBConfig;
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
  routes: Route[];
  middleWares: Middleware[];
  database?: DB;
  setRoutes(routes: Route[]): IServer;
  setMiddlewares(middlewares: Middleware[]): IServer;
  globalErrorHandler?: () => void;
  listen(cb: (...args: unknown[]) => void): Promise<void>;
}

export abstract class BaseServer
  implements Pick<IServer, "app" | "config" | "router" | "database">
{
  app: ServerType = express();

  router: Router = express.Router();

  config: ServerConfig;

  database?: DB;

  constructor(config: ServerConfig) {
    this.config = config;
    setupLogging(config.logPath, config.errorLogPath, config.loggingConfig);

    if (this.config.dbConfig && this.config.dbConfig.dbUrl) {
      this.database = DB.getInstance(
        this.config.dbConfig.dbUrl,
        this.config.dbConfig.dbName
      );
    }
  }
}
