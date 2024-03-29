import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { HttpError, BadRequestError } from "http-errors-enhanced";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import context from "@originator-profile/model/context.json" assert { type: "json" };
import Params from "./params";

const schema: FastifySchema = {
  operationId: "getDocumentProfileSet",
  description: "特定のウェブページ ID の Profile Set の取得",
  params: Params,
  produces: ["application/ld+json"],
  response: {
    200: {
      title: "Profile Set",
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
  const data: JsonLdDocument | Error =
    await server.services.website.getDocumentProfileSet(
      params.id,
      contextDefinition,
    );
  if (data instanceof HttpError) return data;
  if (data instanceof Error) {
    return new BadRequestError("invalid params.id", data);
  }

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getDocumentProfileSet, { schema });
