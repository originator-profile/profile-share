import { FastifySchema, FastifyRequest } from "fastify";
import Params from "./params";

const schema: FastifySchema = {
  params: Params,
  tags: ["user-accounts"],
  description: "ユーザーアカウント情報の取得",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      title: "ユーザーアカウント",
      description: "ユーザーアカウント情報",
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
  return await server.services.userAccount.read(params);
}

export { get, schema };
