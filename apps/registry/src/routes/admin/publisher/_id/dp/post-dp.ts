import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
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
  const sdp = await server.services.publisher.registerDp(accountId, jwt);
  if (sdp instanceof Error) {
    const details = sdp.message;
    throw new BadRequestError(`Invalid issue request: ${details}`);
  }
  const decoded: DecodeResult = server.services.validator.decodeToken(jwt);
  if (decoded instanceof Error) {
    return decoded;
  }
  const res = await server.services.website.read({
    id: decoded.payload.sub,
  });
  if (res instanceof Error) {
    throw new BadRequestError("invalid request");
  }
  return res;
}

export default Object.assign(postDp, { schema });
