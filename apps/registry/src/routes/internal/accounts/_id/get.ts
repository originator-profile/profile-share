import { FastifySchema, FastifyRequest } from "fastify";
import Params from "./params";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";

const schema: FastifySchema = {
  params: Params,
  description: "会員情報の取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "会員",
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
  const { id } = params;

  const data = await server.services.account.read({ id });

  if (data instanceof NotFoundError) {
    throw data;
  } else if (data instanceof Error) {
    throw new BadRequestError("Invalid request");
  }

  return data;
}

export { get, schema };
