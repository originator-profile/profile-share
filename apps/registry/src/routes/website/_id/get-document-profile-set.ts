import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import context from "@originator-profile/model/context.json" assert { type:
  "json" };
import Params from "./params";

const schema: FastifySchema = {
  operationId: "getDocumentProfileSet",
  tags: ["profiles"],
  description: "特定のウェブページ ID の Profile Set の取得",
  params: Params,
  produces: ["application/ld+json"],
  response: {
    200: {
      title: "Profile Set",
      description: "Profile Set",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function getDocumentProfileSet(
  {
    server,
    params,
  }: FastifyRequest<{
    Params: Params;
  }>,
  reply: FastifyReply,
) {
  const contextDefinition: ContextDefinition | undefined =
    server.config.NODE_ENV === "development" ? context["@context"] : undefined;
  const data: JsonLdDocument =
    await server.services.website.getDocumentProfileSet(
      params.id,
      contextDefinition,
    );

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getDocumentProfileSet, { schema });
