import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";
import { OpCredential } from "@originator-profile/model";

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
  description: "会員情報の更新",
  security: [],
  response: {
    200: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    403: ErrorResponse,
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

  const { certifier, verifier, issuedAt, expiredAt, name } = body;

  const result = await server.services.credential.create(
    id,
    certifier,
    verifier,
    name,
    new Date(issuedAt),
    new Date(expiredAt),
  );

  if (result instanceof Error) throw new BadRequestError("Invalid request");
  return result;
}

export { create, schema };
