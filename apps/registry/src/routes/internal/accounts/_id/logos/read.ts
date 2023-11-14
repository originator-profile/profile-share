import { FastifySchema, FastifyRequest } from "fastify";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";

const schema: FastifySchema = {
  params: Params,
  description: "ロゴURLの取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "ロゴURL",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    404: ErrorResponse,
  },
};

async function read({
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  const { id } = params;

  const data = await server.services.logo.readMainLogo({ id });

  if (data instanceof NotFoundError) {
    throw data;
  } else if (data instanceof Error) {
    throw new BadRequestError("Invalid request");
  }

  return data;
}

export { read, schema };
