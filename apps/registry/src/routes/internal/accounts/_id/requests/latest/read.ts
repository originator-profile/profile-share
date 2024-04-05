import { FastifySchema, FastifyRequest } from "fastify";
import Params from "../../params";
import { convertPrismaRequestToOpRequest } from "@originator-profile/registry-db";

const schema: FastifySchema = {
  params: Params,
  description: "最新の申請情報の取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "申請",
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
  const data = await server.services.request.read(params.id);
  return convertPrismaRequestToOpRequest(data);
}

export { read, schema };
