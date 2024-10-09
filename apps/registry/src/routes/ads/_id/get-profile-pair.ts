import { FastifyRequest, FastifySchema } from "fastify";
import { ContextDefinition } from "jsonld";
import context from "@originator-profile/model/context.json" assert { type: "json" };
import Params from "./params";

export const method = "GET";
export const url = "";

export const schema = {
  operationId: "ads.getProfilePair",
  tags: ["profiles"],
  description: "Ad Profile Pair の取得",
  params: Params,
  produces: ["application/ld+json"],
  response: {
    200: {
      title: "Ad Profile Pair",
      description: "Ad Profile Pair",
      type: "object",
      additionalProperties: true,
    },
  },
} satisfies FastifySchema;

export async function handler(req: FastifyRequest<{ Params: Params }>) {
  const contextDefinition: ContextDefinition | undefined =
    req.server.config.NODE_ENV === "development"
      ? context["@context"]
      : undefined;
  return await req.server.services.adRepository.getProfilePair(
    req.params.id,
    contextDefinition,
  );
}
