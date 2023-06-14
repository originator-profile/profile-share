import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { HttpError, BadRequestError } from "http-errors-enhanced";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import context from "@webdino/profile-model/context.json" assert { type: "json" };
import { ErrorResponse } from "../../error";

const Body = {
  type: "object",
  properties: {
    url: { type: "string", format: "uri" },
  },
  required: ["url"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  operationId: "website.getProfileSet",
  description: "Profile Set の取得",
  body: Body,
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

async function getProfileSet(
  {
    server,
    body,
  }: FastifyRequest<{
    Body: Body;
  }>,
  reply: FastifyReply
) {
  const contextDefinition: ContextDefinition | undefined =
    server.config.NODE_ENV === "development" ? context["@context"] : undefined;
  const data: JsonLdDocument | Error =
    await server.services.website.getProfileSet(body.url, contextDefinition);
  if (data instanceof HttpError) return data;
  if (data instanceof Error) {
    return new BadRequestError("invalid body.url", data);
  }

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getProfileSet, { schema });
