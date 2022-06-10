import { Application } from "express";
import { BaseServer, IServer, ServerConfig } from "./server";

export default abstract class ExpressServer
  extends BaseServer
  implements IServer
{
  abstract app: Application;

  abstract setupMiddlewares(): void;
  abstract setupRoutes(): void;
  protected constructor(config: ServerConfig) {
    super(config);
  }

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    this.app.listen(this.config.port, cb);
  }
}
