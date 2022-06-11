import express, { Application } from "express";
import { BaseServer, IServer, Route } from "./server";

export class ExpressServer extends BaseServer implements IServer {
  app: Application = express();

  // setupMiddlewares(): void {}
  // setupRoutes(): void {}

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.app.listen(this.config.port, cb);
  }

  setupRoutes(routes: Route[]): void {
    routes.forEach((route) =>
      this.app.use(route.handler(this.app, route.middlewares))
    );
  }
}
