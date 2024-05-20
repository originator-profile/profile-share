import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const Querystring = {
  type: "object",
  properties: {
    pending: { type: "boolean" },
  },
  additionalProperties: false,
} as const;

type Querystring = FromSchema<typeof Querystring>;

const schema: FastifySchema = {
  querystring: Querystring,
  description: "最新の申請情報リストの取得",
  security: [{ bearerAuth: ["write:requests", "write:reviews"] }],
  response: {
    200: {
      type: "array",
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
