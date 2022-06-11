import express, { Application } from "express";
import { BaseServer, IServer } from "./server";

export class ExpressServer extends BaseServer implements IServer {
  app: Application = express();

  // setupMiddlewares(): void {}
  // setupRoutes(): void {}

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.app.listen(this.config.port, cb);
  }
}
