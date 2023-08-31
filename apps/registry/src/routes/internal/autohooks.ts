import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import auth0Verify from "fastify-auth0-verify"

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(auth0Verify, {domain: "oprdev.jp.auth0.com"});
  fastify.after(() => fastify.addHook("onRequest", fastify.authenticate));
  fastify.register(helmet, {
    hsts: { preload: true },
  });
}

export default autohooks;
