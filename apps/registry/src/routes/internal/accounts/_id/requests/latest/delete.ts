import { FastifySchema, FastifyRequest } from "fastify";
import Params from "../../params";
import { convertPrismaRequestToOpRequest } from "@originator-profile/registry-db";

const schema: FastifySchema = {
  params: Params,
  description: "申請の取り下げ",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "申請",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function deleteLatest(
  req: FastifyRequest<{
    Params: Params;
  }>,
) {
  const data = await req.server.services.request.cancel(req.params.id);
  return convertPrismaRequestToOpRequest(data);
}

export { deleteLatest, schema };
