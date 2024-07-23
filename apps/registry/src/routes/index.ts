import { FastifyInstance } from "fastify";
import * as getJwtVcIssuer from "./get-jwt-vc-issuer";

async function index(fastify: FastifyInstance): Promise<void> {
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
  fastify.route(getJwtVcIssuer);
}

export default index;
