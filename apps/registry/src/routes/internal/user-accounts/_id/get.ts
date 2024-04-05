import { FastifySchema, FastifyRequest } from "fastify";
import Params from "./params";

const schema: FastifySchema = {
  params: Params,
  description: "ユーザーアカウント情報の取得",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      title: "ユーザーアカウント",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function get({
  user,
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  return await server.services.userAccount.read({ id: user.sub }, params);
}

export { get, schema };
