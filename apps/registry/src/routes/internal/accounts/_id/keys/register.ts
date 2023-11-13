import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Jwk, Jwks } from "@originator-profile/model";
import Params from "../params";

export const method = "POST";
export const url = "/";

const Body = {
  type: "object",
  properties: {
    key: Jwk,
  },
  required: ["key"],
} as const satisfies JSONSchema;

type Body = FromSchema<typeof Body>;

export const schema = {
  operationId: "account.registerKey",
  body: Body,
  params: Params,
  description: "JWKの登録",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: Jwks,
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{
    Params: Params;
    Body: Body;
  }>,
): Promise<Error | Jwks> {
  return await req.server.services.account.registerKey(
    req.params.id,
    req.body.key,
  );
}
