import { FastifySchema, FastifyRequest } from "fastify";
import Params from "./params";

const schema: FastifySchema = {
  params: Params,
  description: "会員情報の取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function get({
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  return await server.services.account.read(params);
}

export { get, schema };
