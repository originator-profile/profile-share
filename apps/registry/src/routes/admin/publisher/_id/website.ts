import { FastifySchema, FastifyRequest, HTTPMethods } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { Prisma } from "@prisma/client";
import { ErrorResponse } from "../../../../error";
import Params from "./params";

const Body = {
  type: "object",
  properties: {
    input: {
      type: "object",
      title: "JSON",
      description: `\
[Prisma.websitesCreateInput](https://profile-docs.pages.dev/ts/types/_webdino_profile_registry_db.default.Prisma.websitesCreateInput.html)\
 または \
[Prisma.websitesUpdateInput](https://profile-docs.pages.dev/ts/types/_webdino_profile_registry_db.default.Prisma.websitesUpdateInput.html)\
 を与えます。`,
      additionalProperties: true,
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
    400: ErrorResponse,
  },
};

const operations = {
  POST: "create",
  GET: "read",
  PUT: "update",
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
  const input = (body?.input ?? {}) as Prisma.websitesCreateInput;
  if (typeof input.url !== "string") {
    throw new BadRequestError("invalid url property");
  }
  const data = await server.services.website[operation]({
    ...input,
    account: { connect: { id: params.id } },
  });
  if (data instanceof Error) throw new BadRequestError("invalid request");
  return data;
}

export default Object.assign(website, { schema });
