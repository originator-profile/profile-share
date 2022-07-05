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
Prisma.accountsCreateInput または Prisma.accountsUpdateInput を与えます。
詳細は[データベーススキーマ](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma)を参照してください。`,
      additionalProperties: true,
    },
  },
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  params: Params,
  body: Body,
  description: "会員の作成・表示・更新・削除",
  security: [{ basicAuth: [] }],
  response: {
    200: {
      title: "会員",
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

async function account({
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
  if (operation !== "create" && params.id === "") {
    throw new BadRequestError("Invalid params.id");
  }
  const input = Object.assign(
    body?.input ?? {},
    operation === "create" ? {} : { id: params.id }
  ) as (Prisma.accountsCreateInput & Prisma.accountsUpdateInput) & {
    id: string;
  };
  const data = await server.services.account[operation](input);
  if (data instanceof Error) throw new BadRequestError("Invalid request");
  return data;
}

export default Object.assign(account, { schema });
