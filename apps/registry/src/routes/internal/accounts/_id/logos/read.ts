import { FastifySchema, FastifyRequest } from "fastify";
import Params from "../params";

const schema: FastifySchema = {
  params: Params,
  tags: ["logos"],
  description: "メインロゴの取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "メインロゴの情報",
      description: "メインロゴの情報",
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
