import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../error";
import { OpHolder } from "@originator-profile/model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { type, logos, ...properties } = OpHolder.properties;

const Body = {
  type: "object",
  properties: properties,
  required: ["name", "domainName"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  body: Body,
  description: "会員の新規作成",
  security: [],
  response: {
    201: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
  },
};

async function create(
  {
    server,
    body,
  }: FastifyRequest<{
    Body: Body;
  }>,
  reply: FastifyReply,
) {
  const input = {
    role: { connect: { value: "group" } },
    // 下書き保存を可能にするため、必須のフィールドに仮の値を入れる。
    postalCode: "",
    url: "",
    addressCountry: "",
    addressLocality: "",
    streetAddress: "",
    addressRegion: "",
    ...body,
  };
  const data = await server.services.account.create(input);
  if (data instanceof Error) throw new BadRequestError("Invalid request");
  reply.code(201);
  return data;
}

export { create, schema };
