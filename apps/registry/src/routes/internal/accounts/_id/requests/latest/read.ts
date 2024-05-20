import { FastifyRequest, FastifySchema } from "fastify";
import Params from "../../params";

const schema: FastifySchema = {
  params: Params,
  description: "最新の申請情報の取得",
  tags: ["requests"],
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "申請",
      description: "最新の申請情報",
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
  return await server.services.request.read(params.id);
}

export { read, schema };
