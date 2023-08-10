import { FastifyInstance } from "fastify";
import context from "@originator-profile/model/context.json";
import { FromHandler } from "../types";
import getFrontendProfileSet from "./get-frontend-profile-set";
import getIssuerKeys from "./get-issuer-keys";
import getIssuerProfileSet from "./get-issuer-profile-set";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', (req, reply) => {
    // @ts-expect-error @fastify/vite が html() メソッドを提供
    reply.html();
  });
  fastify.get<FromHandler<typeof getFrontendProfileSet>>(
    "/ps.json",
    { ...getFrontendProfileSet },
    getFrontendProfileSet,
  );
  fastify.get(
    "/context",
    {
      schema: {
        operationId: "getContext",
        produces: ["application/ld+json"],
        response: {
          200: {
            title: "JSON-LD context",
            example: context,
            type: "object",
            additionalProperties: true,
          },
        },
      },
    },
    async (_, reply) => {
      reply.type("application/ld+json");
      return context;
    },
  );
  fastify.get<FromHandler<typeof getIssuerKeys>>(
    "/.well-known/jwks.json",
    { ...getIssuerKeys },
    getIssuerKeys,
  );
  fastify.get<FromHandler<typeof getIssuerProfileSet>>(
    "/.well-known/ps.json",
    { ...getIssuerProfileSet },
    getIssuerProfileSet,
  );
}

export default index;
