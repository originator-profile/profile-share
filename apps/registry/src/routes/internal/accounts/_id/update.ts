import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../error";
import Params from "./params";
import { OpHolder } from "@originator-profile/model";
import { beginTransaction } from "@originator-profile/registry-db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { type, logos, ...properties } = OpHolder.properties;

const Body = {
  type: "object",
  properties: properties,
  required: [],
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
  const { id } = params;
  if (body.id && id !== body.id) {
    throw new BadRequestError("Invalid id");
  }

  const input = { id, ...body };
  const result = await beginTransaction(async () => {
    const data = await server.services.account.updateAccount(input);
    if (data instanceof Error) throw data;
    return data;
  });

  if (result instanceof Error) throw new BadRequestError("Invalid request");
  return result;
}

export { update, schema };
