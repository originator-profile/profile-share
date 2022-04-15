import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import fastify, { FastifyInstance } from "fastify";
import autoload from "fastify-autoload";
import cors from "fastify-cors";
import env from "fastify-env";
import httpErrorsEnhanced from "fastify-http-errors-enhanced";
import swagger, { FastifyDynamicSwaggerOptions } from "fastify-swagger";
import { Config, Services } from "@webdino/profile-registry-service";
import pkg from "../package.json";

type Options = {
  isDev: boolean;
  prisma: PrismaClient;
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
    logger: { prettyPrint: options.isDev },
  });

  if (options.isDev) {
    const writeOpenapi = async (): Promise<void> => {
      const res = await app.inject("/documentation/json");
      await fs.writeFile(path.resolve(__dirname, "openapi.json"), res.payload);
    };

    app.register(swagger, {
      exposeRoute: options.isDev,
      openapi,
    });
    app.ready(writeOpenapi);
  }

  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
    routeParams: true,
  });
  app.register(cors);
  app.register(httpErrorsEnhanced);
  app.register(env, { schema: Config }).after(() => {
    app.decorate(
      "services",
      Services({ config: app.config, prisma: options.prisma })
    );
  });

  return app;
}

export async function start(server: Server): Promise<string> {
  await server.ready();
  const address: string = await server.listen(server.config.PORT, "::");
  return address;
}
