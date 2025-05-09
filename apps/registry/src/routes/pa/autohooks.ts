import basicAuth from "@fastify/basic-auth";
import { FastifyInstance } from "fastify";
import { UnauthorizedError } from "http-errors-enhanced";

async function autohooks(fastify: FastifyInstance): Promise<void> {
  await fastify.register(basicAuth, {
    authenticate: {
      realm: "Profile Annotation Registration API",
    },
    async validate(id, password, req) {
      const valid = await fastify.services.admin.auth(id, password);

      if (!valid) throw new UnauthorizedError("Invalid password");

      req.accountId = id;
    },
  });

  fastify.addHook("onRequest", fastify.basicAuth);
}

export default autohooks;
