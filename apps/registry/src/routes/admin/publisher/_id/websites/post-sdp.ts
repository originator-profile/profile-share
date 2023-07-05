import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { Prisma } from "@prisma/client";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";
import { DecodeResult } from "@webdino/profile-verify";
import { DpHtml, DpText, DpVisibleText } from "@webdino/profile-model";

const Body = {
  type: "object",
  properties: {
    jwt: {
      description: "登録する Signed Document Profile (作成・更新時のみ対応)",
      type: "string",
    },
  },
  required: ["jwt"],
} as const;

type Body = FromSchema<typeof Body>;

export const schema: FastifySchema = {
  params: Params,
  body: Body,
  description: "SDP によるウェブページの作成",
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

export async function postSdp({
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

  const types = [
    DpVisibleText.properties.type.const,
    DpText.properties.type.const,
    DpHtml.properties.type.const,
  ] as const;

  const locator = decoded.payload[
    "https://originator-profile.org/dp"
  ]?.item.find(({ type }: { type: string }) =>
    types.includes(type as (typeof types)[number])
  ) as DpVisibleText | DpText | DpHtml;

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

export default Object.assign(postSdp, { schema });
