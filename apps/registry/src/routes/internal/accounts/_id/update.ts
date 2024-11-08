import { OpHolder } from "@originator-profile/model";
import { FastifyRequest, FastifySchema } from "fastify";
import { BadRequestError } from "http-errors-enhanced";
import { FromSchema } from "json-schema-to-ts";
import Params from "./params";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { type, logos, ...properties } = OpHolder.properties;

const Body = {
  type: "object",
  properties: properties,
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  body: Body,
  params: Params,
  tags: ["accounts"],
  description: "会員情報の更新",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "会員",
      description: "更新後の会員情報",
      type: "object",
      additionalProperties: true,
    },
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

  return await server.services.account.update(input);
}

export { schema, update };
