import {
  FastifyError,
  FastifyInstance,
  FastifyRequest,
  onRouteHookHandler,
} from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../error";

function onPrismaClientKnownRequestError(
  error: FastifyError,
  req: FastifyRequest,
) {
  if (error instanceof PrismaClientKnownRequestError) {
    req.log.info(error.message);

    return new BadRequestError(`PrismaClientKnownRequestError: ${error.code}`);
  }

  return error;
}

const addErrorResponseSchema: onRouteHookHandler = async (opt) => {
  if (opt.schema?.hide) return;

  if (!opt.schema?.response) {
    throw new Error(
      `The property schema.response is missing on ${opt.method} ${opt.path}`,
    );
  }

  Object.assign(opt.schema.response, {
    400: ErrorResponse, // from http-errors-enhanced, PrismaClientKnownRequestError
    404: ErrorResponse, // from http-errors-enhanced
  });
};

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("onRoute", addErrorResponseSchema);
  fastify.setErrorHandler(onPrismaClientKnownRequestError);
}

export default autohooks;
