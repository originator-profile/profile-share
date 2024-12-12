import type { FastifyInstance } from "fastify";

async function autohooks(fastify: FastifyInstance): Promise<void> {
  if (fastify.config.BASIC_AUTH) {
    fastify.addHook("onRequest", fastify.basicAuth);
  }
}

export default autohooks;
