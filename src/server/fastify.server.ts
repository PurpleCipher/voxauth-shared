import { FastifyInstance } from "fastify";
import { BaseServer, IServer } from "./server";

export abstract class FastifyServer extends BaseServer implements IServer {
  abstract app: FastifyInstance;
  abstract setupRoutes(): void;

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    await this.app.listen({
      port: this.config.port,
    });
    cb();
  }
}
