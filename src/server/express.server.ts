import { Application } from "express";
import { BaseServer, IServer } from "./server";

export abstract class ExpressServer extends BaseServer implements IServer {
  abstract app: Application;

  abstract setupMiddlewares(): void;
  abstract setupRoutes(): void;

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.app.listen(this.config.port, cb);
  }
}
