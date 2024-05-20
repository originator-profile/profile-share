import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const Querystring = {
  type: "object",
  properties: {
    pending: {
      type: "boolean",
      title: "申請ステータスによるフィルター",
      description: `レスポンスの申請リストをフィルタリングします。
審査中の申請だけを欲しいときは true を、それ以外の申請だけが欲しいときは false を指定してください。
両方欲しいときは指定しないでください。`,
    },
  },
  additionalProperties: false,
} as const;

type Querystring = FromSchema<typeof Querystring>;

const schema: FastifySchema = {
  querystring: Querystring,
  tags: ["requests"],
  description: "最新の申請情報リストの取得",
  security: [{ bearerAuth: ["write:requests", "write:reviews"] }],
  response: {
    200: {
      type: "array",
      description: "申請情報リスト",
      items: {
        title: "申請",
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

async function read({
  server,
  query,
}: FastifyRequest<{
  Querystring: Querystring;
}>) {
  return await server.services.request.readList(query);
}

export { read, schema };
