import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { HttpError, BadRequestError } from "http-errors-enhanced";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import context from "@webdino/profile-model/context.json" assert { type: "json" };
import { ErrorResponse } from "../../../error";
import Params from "./params";

const schema: FastifySchema = {
  operationId: "getDocumentProfileSet",
  params: Params,
  produces: ["application/ld+json"],
  response: {
    200: {
      title: "Profile Set",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    404: ErrorResponse,
  },
};

async function getDocumentProfileSet(
  {
    server,
    params,
  }: FastifyRequest<{
    Params: Params;
  }>,
  reply: FastifyReply
) {
  const contextDefinition: ContextDefinition | undefined =
    server.config.NODE_ENV === "development" ? context["@context"] : undefined;
  const data: JsonLdDocument | Error =
    await server.services.website.getDocumentProfileSet(
      params.id,
      contextDefinition
    );
  if (data instanceof HttpError) return data;
  if (data instanceof Error) {
    return new BadRequestError("invalid params.id", data);
  }

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getDocumentProfileSet, { schema });
