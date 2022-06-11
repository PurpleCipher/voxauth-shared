import express, { Application } from "express";
import { BaseServer, IServer, Route } from "./server";

export class ExpressServer extends BaseServer implements IServer {
  app: Application = express();

  routes: Route[] = [];

  // setupMiddlewares(): void {}
  // setupRoutes(): void {}

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.setupRoutes(this.routes);
    this.app.listen(this.config.port, cb);
  }

  setRoutes(routes: Route[]): IServer {
    this.routes = routes;
    return this;
  }

  private setupRoutes(routes: Route[]): void {
    routes.forEach((route) =>
      this.app.use(route.handler(this.app, route.middlewares))
    );
  }
}
