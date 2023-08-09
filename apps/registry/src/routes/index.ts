import { FastifyInstance } from "fastify";
import path from "node:path";
import serveHandler from "serve-handler";
import context from "@originator-profile/model/context.json";
import { FromHandler } from "../types";
import getFrontendProfileSet from "./get-frontend-profile-set";
import getIssuerKeys from "./get-issuer-keys";
import getIssuerProfileSet from "./get-issuer-profile-set";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', (req, reply) => {
    reply.html();
  });
  fastify.get(
    "*",
    { schema: { operationId: "frontend" } },
    async (req, res) => {
      await serveHandler(req.raw, res.raw, {
        public: path.resolve(__dirname, "../../dist/public"),
        directoryListing: false,
        headers: [{
          source : "**/*.@(svg|png)",
          headers : [{
            key : "Access-Control-Allow-Origin",
            value : "*"
          }]
        }],
      });
    },
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
