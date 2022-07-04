import { FastifyInstance } from "fastify";
import basicAuth from "@fastify/basic-auth";
import helmet from "@fastify/helmet";
import { UnauthorizedError } from "http-errors-enhanced";

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(basicAuth, {
    authenticate: { realm: "Profile Registry" },
    async validate(id, password) {
      const valid = await fastify.services.admin.auth(id, password);
      if (!valid) throw new UnauthorizedError("Invalid password");
    },
  });
  fastify.after(() => fastify.addHook("onRequest", fastify.basicAuth));
  fastify.register(helmet, {
    hsts: { preload: true },
  });
}

export default autohooks;
