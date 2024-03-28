import { FastifySchema, FastifyRequest } from "fastify";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../../error";
import Params from "../../params";
import { convertToModel } from "@originator-profile/registry-db";

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
    400: ErrorResponse,
  },
};

async function deleteLatest(
  req: FastifyRequest<{
    Params: Params;
  }>,
) {
  const { id } = req.params;

  const result = await req.server.services.request.cancel(id);

  if (result instanceof Error) return new BadRequestError("Invalid request");
  return convertToModel(result);
}

export { deleteLatest, schema };
