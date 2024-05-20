import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Jwk, Jwks } from "@originator-profile/model";
import Params from "../params";

export const method = "POST";
export const url = "/";

const Body = {
  type: "object",
  description: "登録する公開鍵を JWK 形式で与えてください。",
  properties: {
    key: Jwk,
  },
  required: ["key"],
} as const satisfies JSONSchema;

type Body = FromSchema<typeof Body>;

export const schema = {
  operationId: "account.registerKey",
  tags: ["keys"],
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
