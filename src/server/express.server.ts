import express, { Application, NextFunction, Request, Response } from "express";
import { BaseServer, IServer, Middleware, Route } from "./server";
import { APIError } from "../utility";

export class ExpressServer extends BaseServer implements IServer {
  app: Application = express();

  routes: Route[] = [];

  middleWares: Middleware[] = [];

  globalErrorHandler?: () => void;

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.setupMiddlewares(this.middleWares);
    this.setupRoutes(this.routes);
    if (!this.config.globalErrorHandler) {
      this.globalErrorHandler = this.errorHandlers;
    } else {
      this.globalErrorHandler = this.config.globalErrorHandler;
    }
    this.globalErrorHandler();
    this.app.listen(this.config.port, cb);
  }

  setRoutes(routes: Route[]): IServer {
    this.routes = [...routes];
    return this;
  }

  setMiddlewares(middlewares: Middleware[]): IServer {
    this.middleWares = [...middlewares];
    return this;
  }

  private setupMiddlewares(middlewares: Middleware[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private setupRoutes(routes: Route[]): void {
    routes.forEach((route) =>
      this.app.use(route.handler(this.app, route.middlewares))
    );
  }

  private errorHandlers(): void {
    // eslint-disable-next-line
    this.app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
      const apiError = new APIError(err.name, err.message);
      res.status(apiError.httpCode).send(err.message);
    });
    this.app.all("*", (req, res) => {
      res.status(404).json({
        success: false,
        data: "404",
      });
    });
  }
}
