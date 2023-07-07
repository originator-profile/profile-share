import { PrismaClient } from "@prisma/client";
import fastify, { FastifyInstance } from "fastify";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import env from "@fastify/env";
import helmet from "@fastify/helmet";
import swagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import httpErrorsEnhanced from "fastify-http-errors-enhanced";
import { Config, Services } from "@webdino/profile-registry-service";
import pkg from "./package.json";

type Options = {
  isDev: boolean;
  prisma: PrismaClient;
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

export function create(options: Options): Server {
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
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  });
  app.register(httpErrorsEnhanced);
  app.after(() => {
    app.decorate(
      "services",
      Services({ config: app.config, prisma: options.prisma }),
    );
  });

  return app;
}

export async function start(server: Server, port: number): Promise<string> {
  await server.ready();
  const address: string = await server.listen({ port, host: "::" });
  return address;
}
