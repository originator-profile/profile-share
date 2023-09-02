import fastify, { FastifyInstance } from "fastify";
// @ts-expect-error 型パッケージがない
import FastifyVite from "@fastify/vite";
import fastifyStatic from "@fastify/static";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import env from "@fastify/env";
import helmet from "@fastify/helmet";
import swagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import httpErrorsEnhanced from "fastify-http-errors-enhanced";
import { Config, Services } from "@originator-profile/registry-service";
import pkg from "./package.json";
import { resolve } from "node:path";

type Options = {
  isDev: boolean;
  routes: string;
  quiet?: boolean;
};

type Server = FastifyInstance;

const openapi: FastifyDynamicSwaggerOptions["openapi"] = {
  info: {
    title: pkg.description,
    version: pkg.version,
    description: "Profile Registry API Documentation.",
  },
  components: {
    securitySchemes: {
      basicAuth: {
        type: "http",
        scheme: "basic",
      },
    },
  },
};

export async function create(options: Options): Promise<Server> {
  const app = fastify({
    logger: !options.quiet,
  });

  if (options.isDev) {
    app.register(swagger, { openapi });
    app.register(swaggerUi, {
      // NOTE: esbuild でのバンドルに失敗する問題の回避策
      //       ロゴが失われる代わりに require.resolve() を呼び出さないようにする
      logo: { type: "text/plain", content: "" },
    });
  }
  app.register(autoload, {
    dir: options.routes,
    routeParams: true,
    autoHooks: true,
    cascadeHooks: true,
  });
  app.register(cors);
  app.register(env, { schema: Config });
  app.register(helmet, {
    hsts: { preload: true },
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "'unsafe-inline'"],
        // NOTE: Vite Dev Server 対応
        "connect-src": ["http://localhost:24678", "ws://localhost:24678"],
        "frame-ancestors": "'self'",
      },
    },
    crossOriginResourcePolicy: {
      policy: "same-origin",
    },
  });
  app.register(httpErrorsEnhanced);

  const REGISTRY_ROOT = resolve(require.main?.path ?? "", "..");

  // @fastify/vite が public ディレクトリを無視するため
  // https://github.com/fastify/fastify-vite/issues/105
  await app.register(fastifyStatic, {
    root: resolve(REGISTRY_ROOT, "../../packages/registry-ui/public"),
  });

  await app.register(FastifyVite, {
    dev: options.isDev,
    root: REGISTRY_ROOT,
    spa: true,
  });

  app.after(() => {
    app.decorate("services", Services({ config: app.config }));
  });

  return app;
}

export async function start(server: Server, port: number): Promise<string> {
  // @ts-expect-error Property 'vite' does not exist on type 'Server'.
  await server.vite.ready();
  await server.ready();
  const address: string = await server.listen({ port, host: "::" });
  return address;
}
