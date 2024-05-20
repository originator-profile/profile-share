import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import AccountParams from "../params";

export const method = "DELETE";
export const url = "/:kid";

const Params = {
  type: "object",
  properties: {
    ...AccountParams.properties,
    kid: {
      title: "Key ID",
      type: "string",
      description: "削除対象の JWK の kid を与えてください。",
    },
  },
  required: ["id", "kid"],
  additionalProperties: false,
} as const satisfies JSONSchema;

type Params = FromSchema<typeof Params>;

export const schema = {
  operationId: "account.destroyKey",
  tags: ["keys"],
  params: Params,
  description: "JWKの削除",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "Key ID",
      description: "削除された JWK の kid",
      type: "string",
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{
    Params: Params;
  }>,
): Promise<Error | string> {
  return await req.server.services.account.destroyKey(
    req.params.id,
    req.params.kid,
  );
}
