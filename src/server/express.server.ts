import express, { Application } from "express";
import { BaseServer, IServer, Middleware, Route } from "./server";

export class ExpressServer extends BaseServer implements IServer {
  app: Application = express();

  routes: Route[] = [];

  middleWares: Middleware[] = [];

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.setupRoutes(this.routes);
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

  private setupMiddlewares() {
    this.middleWares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private setupRoutes(routes: Route[]): void {
    routes.forEach((route) =>
      this.app.use(route.handler(this.app, route.middlewares))
    );
  }
}
