import {
  FastifySchema,
  FastifyRequest,
  FastifyReply,
  DoneFuncWithErrOrRes,
} from "fastify";
import { ErrorResponse } from "../../../../error";
import Params from "./params";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";

const schema: FastifySchema = {
  params: Params,
  description: "会員情報の取得",
  security: [],
  response: {
    200: {
      title: "会員",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    404: ErrorResponse,
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

export function preHandler(
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
  const user = request.user;
  // @ts-expect-error
  if (user.permissions.includes("write:requests")) {
    done();
  } else {
    done(new BadRequestError("Insufficient permissions"));
  }
}

export { get, schema };
