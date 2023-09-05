import { FastifyInstance, FastifyRequest } from "fastify";
import helmet from "@fastify/helmet";
import auth0Verify from "fastify-auth0-verify";
import { ForbiddenError } from "http-errors-enhanced";

export async function preHandler(request: FastifyRequest) {
  const user = request.user;
  if (user.permissions.includes("write:requests")) {
    return;
  } else {
    return new ForbiddenError("Insufficient permissions");
  }
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(auth0Verify, {
    domain: process.env.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com",
    audience: process.env.AUTH0_AUDIENCE ?? "http://localhost:8080/",
  });
  fastify.after(() => {
    fastify.addHook("onRequest", fastify.authenticate);
    fastify.addHook("preHandler", preHandler);
  });
  fastify.register(helmet, {
    hsts: { preload: true },
  });
}

export default autohooks;
