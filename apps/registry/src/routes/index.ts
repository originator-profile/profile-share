import { FastifyInstance } from "fastify";
import context from "@originator-profile/model/context.json";
import { FromHandler } from "../types";
import getFrontendProfileSet from "./get-frontend-profile-set";
import getIssuerKeys from "./get-issuer-keys";
import getIssuerProfileSet from "./get-issuer-profile-set";
import getJwtVcIssuer from "./get-jwt-vc-issuer";

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
        tags: ["registry"],
        produces: ["application/ld+json"],
        response: {
          200: {
            title: "JSON-LD context",
            description: "JSON-LD context",
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
  fastify.get<FromHandler<typeof getIssuerProfileSet>>(
    "/.well-known/jwt-vc-issuer",
    { ...getJwtVcIssuer },
    getJwtVcIssuer,
  );
}

export default index;
