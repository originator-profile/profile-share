import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import Params from "../params";
import { OpCredential } from "@originator-profile/model";
import { parseExpirationDate } from "@originator-profile/core";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { type, image, ...properties } = OpCredential.properties;

const Body = {
  type: "object",
  properties: properties,
  required: ["certifier", "verifier", "issuedAt", "expiredAt", "name"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  body: Body,
  params: Params,
  description: "資格情報の登録",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function create({
  server,
  body,
  params,
}: FastifyRequest<{
  Body: Body;
  Params: Params;
}>) {
  const { id } = params;

  const { certifier, verifier, issuedAt, expiredAt, name, url } = body;

  const result = await server.services.credential.create(
    id,
    certifier,
    verifier,
    name,
    new Date(issuedAt),
    parseExpirationDate(expiredAt),
    url,
  );

  if (result instanceof Error) throw new BadRequestError("Invalid request");
  return result;
}

export { create, schema };
