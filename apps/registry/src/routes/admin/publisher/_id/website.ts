import { FastifySchema, FastifyRequest, HTTPMethods } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { Prisma } from "@prisma/client";
import Params from "./params";

const Body = {
  type: "object",
  properties: {
    input: {
      type: "object",
      title: "JSON",
      description: `\
[Prisma.websitesCreateInput](https://docs.originator-profile.org/ts/types/_originator_profile_registry_db.default.Prisma.websitesCreateInput.html)\
 または \
[Prisma.websitesUpdateInput](https://docs.originator-profile.org/ts/types/_originator_profile_registry_db.default.Prisma.websitesUpdateInput.html)\
 を与えます。`,
      additionalProperties: true,
    },
    jwt: {
      description: "登録する Signed Document Profile (作成・更新時のみ対応)",
      type: "string",
    },
  },
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  params: Params,
  body: Body,
  description: "ウェブページの作成・表示・更新・削除",
  security: [{ basicAuth: [] }],
  response: {
    200: {
      title: "ウェブページ",
      type: "object",
      additionalProperties: true,
    },
  },
};

const operations = {
  POST: "createForOldAPI",
  GET: "read",
  PUT: "updateForOldAPI",
  DELETE: "delete",
} as const;

async function website({
  server,
  params,
  body,
  method,
}: FastifyRequest<{
  Params: Params;
  Body?: Body;
}>) {
  const operation =
    operations[method as Extract<HTTPMethods, keyof typeof operations>];
  const input = (body?.input ?? {}) as Prisma.websitesCreateInput & {
    id: string;
  };
  if (typeof input.id !== "string") {
    throw new BadRequestError("invalid id property");
  }

  const res = await server.services.website[operation]({
    ...input,
    account: { connect: { id: params.id } },
  });

  if (!body?.jwt) return res;
  if (!["create", "update"].includes(operation)) return res;

  await server.services.publisher.registerDp(params.id, body.jwt);

  return res;
}

export default Object.assign(website, { schema });
