import { PrismaClient } from "@prisma/client";
import fastify, { FastifyInstance } from "fastify";
import autoload from "@fastify/autoload";
import basicAuth from "@fastify/basic-auth";
import cors from "@fastify/cors";
import env from "@fastify/env";
import swagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import httpErrorsEnhanced from "fastify-http-errors-enhanced";
import crypto from "node:crypto";
import { UnauthorizedError } from "http-errors-enhanced";
import { Config, Services } from "@webdino/profile-registry-service";
import pkg from "./package.json";

type Options = {
  isDev: boolean;
  prisma: PrismaClient;
  routes: string;
  basicAuthToken?: string;
  quiet?: boolean;
};

type Server = FastifyInstance;

const openapi: FastifyDynamicSwaggerOptions["openapi"] = {
  info: {
    title: pkg.description,
    version: pkg.version,
    description: "Profile Registry API Documentation.",
  },
};

export function create(options: Options): Server {
  const app = fastify({
    logger: !options.quiet && { prettyPrint: options.isDev },
  });

  if (options.isDev) {
    app.register(swagger, {
      exposeRoute: options.isDev,
      openapi,
    });
  }
  app.register(autoload, {
    dir: options.routes,
    routeParams: true,
  });
  if (options.basicAuthToken !== undefined) {
    const token: string = options.basicAuthToken;
    app.register(basicAuth, {
      authenticate: { realm: "Profile Registry" },
      async validate(_, password) {
        const valid = crypto.timingSafeEqual(
          Buffer.from(password),
          Buffer.from(token)
        );
        if (!valid) throw new UnauthorizedError("Invalid API token");
      },
    });
    app.after(() => app.addHook("onRequest", app.basicAuth));
  }
  app.register(cors);
  app.register(env, { schema: Config });
  app.register(httpErrorsEnhanced);
  app.after(() => {
    app.decorate(
      "services",
      Services({ config: app.config, prisma: options.prisma })
    );
  });

  return app;
}

export async function start(server: Server, port: number): Promise<string> {
  await server.ready();
  const address: string = await server.listen({ port, host: "::" });
  return address;
}
