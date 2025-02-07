import type { FastifyInstance } from "fastify";
import * as getJwks from "./get-jwks";

async function index(fastify: FastifyInstance): Promise<void> {
  if (fastify.config.BASIC_AUTH) {
    fastify.addHook("onRequest", fastify.basicAuth);
  }

  fastify.get(
    "/",
    {
      schema: {
        operationId: "frontend",
        hide: true,
        produces: ["text/html"],
        response: {
          200: {
            type: "string",
          },
        },
      },
    },
    (_, reply) => reply.html(),
  );
  fastify.get(
    "/app/*",
    {
      schema: {
        hide: true,
      },
    },
    (_, reply) => reply.html(),
  );
  fastify.route(getJwks);
}

export default index;
