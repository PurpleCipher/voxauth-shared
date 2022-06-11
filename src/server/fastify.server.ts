import Fastify, { FastifyInstance } from "fastify";
import { BaseServer, IServer } from "./server";

export class FastifyServer extends BaseServer implements IServer {
  app: FastifyInstance = Fastify({});

  // setupRoutes(): void {}

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    await this.app.listen({
      port: this.config.port,
    });
    cb();
  }
}
