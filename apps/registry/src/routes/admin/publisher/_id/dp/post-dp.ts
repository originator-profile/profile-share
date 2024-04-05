import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import Params from "./params";
import { DecodeResult } from "@originator-profile/verify";

const Body = {
  type: "object",
  properties: {
    jwt: {
      description: "Signed Document Profile",
      type: "string",
    },
  },
  required: ["jwt"],
} as const;

type Body = FromSchema<typeof Body>;

export const schema: FastifySchema = {
  operationId: "registerSignedDocumentProfile",
  params: Params,
  body: Body,
  description: "Signed Document Profile (SDP) を更新・登録します",
  security: [{ basicAuth: [] }],
  response: {
    200: {
      title: "ウェブページ",
      type: "object",
      additionalProperties: true,
    },
  },
};

export async function postDp({
  server,
  params,
  body,
}: FastifyRequest<{
  Params: Params;
  Body: Body;
}>) {
  const { id: accountId } = params;
  const { jwt } = body;

  // SDP を更新・登録
  await server.services.publisher.registerDp(accountId, jwt);

  const decoded: DecodeResult = server.services.validator.decodeToken(jwt);

  return await server.services.website.read({
    id: decoded.payload.sub,
  });
}

export default Object.assign(postDp, { schema });
