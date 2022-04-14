import { FastifyInstance } from "fastify";
import context from "@webdino/profile-model/context.json";
import { FromHandler } from "../types";
import getIssuerKeys from "./get-issuer-keys";
import getIssuerProfiles from "./get-issuer-profiles";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/",
    {
      schema: {
        operationId: "getIndex",
        description: "print routes",
      },
    },
    async () => fastify.printRoutes()
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
    }
  );
  fastify.get<FromHandler<typeof getIssuerKeys>>(
    "/.well-known/jwks.json",
    { ...getIssuerKeys },
    getIssuerKeys
  );
  fastify.get<FromHandler<typeof getIssuerProfiles>>(
    "/.well-known/op-document",
    { ...getIssuerProfiles },
    getIssuerProfiles
  );
}

export default index;
