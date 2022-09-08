import express, { Application, NextFunction, Request, Response } from "express";
import { expressjwt } from "express-jwt";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { BaseServer, IServer, JWTParams, Middleware, Route } from "./server";
import { APIError } from "../utility";
import { setDbConnection } from "../middleware";

export class ExpressServer extends BaseServer implements IServer {
  app: Application = express();

  routes: Route[] = [];

  middleWares: Middleware[] = [];

  openRoutes: string[] = [];

  jwtConfig: JWTParams | undefined = undefined;

  globalErrorHandler?: () => void;

  async listen(cb: (...args: unknown[]) => void): Promise<void> {
    if (this.config.sentryDsn) {
      Sentry.init({
        dsn: this.config.sentryDsn,
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Tracing.Integrations.Express({ app: this.app }),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.5,
      });
      this.app.use(Sentry.Handlers.requestHandler());
      this.app.use(Sentry.Handlers.tracingHandler());
    }
    this.setupMiddlewares(this.middleWares);
    this.setupRoutes(this.routes);

    if (this.config.sentryDsn) {
      this.app.use(Sentry.Handlers.errorHandler());
    }

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

  setJwtConfig(jwtConfig: JWTParams): IServer {
    this.jwtConfig = jwtConfig;
    return this;
  }

  setOpenRoutes(openRoutes: string[]): IServer {
    this.openRoutes = [...openRoutes];
    return this;
  }

  private setupMiddlewares(middlewares: Middleware[]) {
    if (this.database) {
      this.app.use(
        setDbConnection(!!this.config.dbConfig?.isMultiTenant, this.database)
      );
    }
    if (this.jwtConfig) {
      this.app.use(
        expressjwt(this.jwtConfig).unless({ path: this.openRoutes })
      );
    }
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private setupRoutes(routes: Route[]): void {
    routes.forEach((route) =>
      this.app.use(route.handler(this.router, route.middlewares))
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
