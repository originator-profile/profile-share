import { FastifySchema, FastifyRequest } from "fastify";
import Params from "./params";

const schema: FastifySchema = {
  params: Params,
  description: "ロゴURLの取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "ロゴURL",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function read({
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  return await server.services.logo.readMainLogo(params);
}

export { read, schema };
