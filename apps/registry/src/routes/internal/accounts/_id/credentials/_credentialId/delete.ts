import { FastifySchema, FastifyRequest } from "fastify";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../../error";
import Params from "./params";

const schema: FastifySchema = {
  params: Params,
  description: "資格情報の削除",
  security: [],
  response: {
    200: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    403: ErrorResponse,
  },
};

async function deleteOne({
  server,
  params,
}: FastifyRequest<{
  Body: Body;
  Params: Params;
}>) {
  const { id, credentialId } = params;
  const result = await server.services.credential.delete(credentialId, id);

  if (result instanceof Error) throw new BadRequestError("Invalid request");
  return result;
}

export { deleteOne, schema };
