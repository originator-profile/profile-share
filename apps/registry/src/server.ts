import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import env from "@fastify/env";
import helmet from "@fastify/helmet";
import vite from "@fastify/vite";
import { Config, Services } from "@originator-profile/registry-service";
import fastify, { FastifyInstance } from "fastify";
import httpErrorsEnhanced from "fastify-http-errors-enhanced";
import { resolve } from "node:path";
import { basicAuth, swaggerSetup, versionInfo } from "./plugins";

export type Options = {
  isDev: boolean;
  routes?: string;
  quiet?: boolean;
  /** テスト用の認証の無効化オプション (**本番環境では厳禁**) */
  dangerouslyDisabledAuth?: boolean;
  hideInternalDocs?: boolean;
};

export type Server = FastifyInstance;

export async function create(options: Options): Promise<Server> {
  const app = fastify({
    logger: !options.quiet,
  });

  await app.register(httpErrorsEnhanced, {
    allowUndeclaredResponses: true,
    convertResponsesValidationErrors: false,
    hideUnhandledErrors: !options.isDev,
  });

  await app.register(env, { schema: Config });
  /* options.quietの値を優先する */
  app.after(() => {
    app.config.LOG_QUIET = options.quiet;
  });

  if (options.isDev && options.dangerouslyDisabledAuth === true) {
    app.decorate("dangerouslyDisabledAuth", true);
  }

  await app.register(basicAuth);
  await app.register(swaggerSetup, options);
  await app.register(versionInfo);

  await app.register(autoload, {
    dir: options.routes ?? resolve(__dirname, "routes"),
    routeParams: true,
    autoHooks: true,
    cascadeHooks: true,
  });

  await app.register(cors, {
    origin: true,
    credentials: app.config.BASIC_AUTH,
  });

  const viteHmr =
    app.config.NODE_ENV === "development"
      ? ["http://localhost:24678", "ws://localhost:24678"]
      : [];
  const staticServer =
    app.config.NODE_ENV === "development" ? ["http://localhost:8081"] : [];

  await app.register(helmet, {
    hsts: { preload: true },
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "http:", "https:", "data:"],
        "connect-src": ["'self'", "https:", ...viteHmr],
        "frame-src": ["'self'", ...staticServer],
        "frame-ancestors": "'self'",
        "trusted-types": "*",
        "require-trusted-types-for": "'script'",
      },
    },
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    crossOriginOpenerPolicy: {
      policy: options.isDev
        ? // Swagger UIがwindow.openerを使用しているおり、認証出来ないので回避
          "unsafe-none"
        : "same-origin",
    },
  });

  const REGISTRY_ROOT = resolve(require.main?.path ?? "", "..");
  const REGISTRY_UI_DIST = resolve(
    REGISTRY_ROOT,
    "../../packages/registry-ui/dist",
  );

  await app.register(vite, {
    dev: options.isDev,
    root: REGISTRY_ROOT,
    distDir: REGISTRY_UI_DIST,
    spa: true,
  });

  app.decorate("services", Services({ config: app.config }));

  return app;
}

export async function start(server: Server, port: number): Promise<string> {
  await server.vite.ready();
  await server.ready();
  const address: string = await server.listen({ port, host: "::" });
  return address;
}
