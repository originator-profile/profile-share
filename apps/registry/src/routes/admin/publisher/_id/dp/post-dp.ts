import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";
import { DecodeResult } from "@webdino/profile-verify";
import { findFirstItemWithProof } from "@webdino/profile-core";

const Body = {
  type: "object",
  properties: {
    jwt: {
      description: "登録する Signed Document Profile",
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
  description: "Signed Document Profile (SDP) をレジストリに登録します",
  security: [{ basicAuth: [] }],
  response: {
    200: {
      title: "ウェブページ",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
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

  // sdp をデコード
  const decoded: DecodeResult = server.services.validator.decodeToken(jwt);
  if (decoded instanceof Error) {
    return decoded;
  }

  if (!("dp" in decoded)) {
    throw new BadRequestError("invalid jwt");
  }

  const locator = findFirstItemWithProof(decoded.payload);

  if (typeof locator === "undefined") {
    throw new BadRequestError("dp doesn't contain item with proof");
  }

  // website テーブルに保存
  const res = await server.services.website.create({
    id: decoded.payload.sub,
    location: locator.location,
    bodyFormat: locator.type,
    url: locator.url,
    proofJws: locator.proof.jws,
    accountId,
  });
  if (res instanceof Error) {
    throw new BadRequestError("invalid request");
  }
  // SDP を登録
  const dpId = await server.services.publisher.registerDp(accountId, jwt);
  if (dpId instanceof Error) {
    const details = dpId.message;
    throw new BadRequestError(`Invalid issue request: ${details}`);
  }

  return res;
}

export default Object.assign(postDp, { schema });
