import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../../error";
import Params from "./params";
import { OpCredential } from "@originator-profile/model";
import { parseExpirationDate } from "@originator-profile/core";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { type, image, ...properties } = OpCredential.properties;

const Body = {
  type: "object",
  properties: properties,
  required: ["certifier", "verifier", "issuedAt", "expiredAt"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  body: Body,
  params: Params,
  description: "資格情報の更新",
  security: [],
  response: {
    200: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
  },
};

async function update({
  server,
  body,
  params,
}: FastifyRequest<{
  Body: Body;
  Params: Params;
}>) {
  const { id, credentialId } = params;
  if (body.id && id !== body.id) {
    throw new BadRequestError("Invalid id");
  }

  const { certifier, verifier, issuedAt, expiredAt, name } = body;

  const data = {
    certifierId: certifier,
    verifierId: verifier,
    issuedAt: new Date(issuedAt),
    expiredAt: parseExpirationDate(expiredAt),
    name,
  };

  const result = await server.services.credential.update(
    credentialId,
    id,
    data,
  );

  if (result instanceof Error) throw new BadRequestError("Invalid request");
  return result;
}

export { update, schema };
