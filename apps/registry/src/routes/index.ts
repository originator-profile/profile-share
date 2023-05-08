import { FastifyInstance } from "fastify";
import path from "node:path";
import serveHandler from "serve-handler";
import context from "@webdino/profile-model/context.json";
import { FromHandler } from "../types";
import getIssuerKeys from "./get-issuer-keys";
import getIssuerProfiles from "./get-issuer-profiles";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "*",
    { schema: { operationId: "frontend" } },
    async (req, res) => {
      await serveHandler(req.raw, res.raw, {
        public: path.resolve(__dirname, "../../dist/public"),
        directoryListing: false,
      });
    }
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
    "/.well-known/ps.json",
    { ...getIssuerProfiles },
    getIssuerProfiles
  );
}

export default index;
