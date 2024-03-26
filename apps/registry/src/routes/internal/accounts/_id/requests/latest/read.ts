import { FastifySchema, FastifyRequest } from "fastify";
import Params from "../../params";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";

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
  const { id } = params;

  const data = await server.services.request.read(id);

  if (data instanceof NotFoundError) {
    throw data;
  } else if (data instanceof Error) {
    throw new BadRequestError("Invalid request");
  }

  return data;
}

export { read, schema };
