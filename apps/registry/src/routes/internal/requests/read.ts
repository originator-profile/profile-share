import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";

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
  security: [{ bearerAuth: ["write:requests"] }],
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
  const data = await server.services.request.readList(query);

  if (data instanceof Error) {
    throw new BadRequestError("Invalid request");
  }

  return data;
}

export { read, schema };
