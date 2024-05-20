import { FastifySchema, FastifyRequest } from "fastify";
import Params from "../params";

const schema: FastifySchema = {
  params: Params,
  description: "審査結果である申請情報のリストの取得",
  tags: ["requests"],
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      type: "array",
      description: "審査結果である申請情報のリスト",
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
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  return await server.services.request.readResults(params.id);
}

export { read, schema };
