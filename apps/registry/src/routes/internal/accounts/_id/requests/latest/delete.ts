import { FastifyRequest, FastifySchema } from "fastify";
import Params from "../../params";

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
  return await req.server.services.request.cancel(req.params.id);
}

export { deleteLatest, schema };
