import fastifyBasicAuth from "@fastify/basic-auth";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { UnauthorizedError } from "http-errors-enhanced";
import crypto from "node:crypto";

const callback: FastifyPluginAsync = async (app) => {
  await app.register(fastifyBasicAuth, {
    authenticate: {
      realm: "Originator Profile Registration API",
    },
    async validate(username, password) {
      const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = app.config;

      if (
        BASIC_AUTH_USERNAME === username &&
        BASIC_AUTH_PASSWORD?.length === password.length &&
        crypto.timingSafeEqual(
          Buffer.from(password),
          Buffer.from(BASIC_AUTH_PASSWORD),
        )
      ) {
        return;
      }

      throw new UnauthorizedError("Invalid password");
    },
  });
};

export const basicAuth = fp(callback, {
  name: "basic-auth",
});
