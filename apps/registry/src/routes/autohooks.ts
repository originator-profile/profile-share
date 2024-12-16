import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  FastifyError,
  FastifyInstance,
  FastifyRequest,
  onRouteHookHandler,
} from "fastify";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import merge from "just-merge";
import { ErrorResponse } from "../error";

function onPrismaClientKnownRequestError(
  error: FastifyError,
  req: FastifyRequest,
) {
  if (error instanceof PrismaClientKnownRequestError) {
    req.log.info(error.message);

    if (error.code === "P2025") {
      return new NotFoundError("resource not found.");
    }
    return new BadRequestError(`PrismaClientKnownRequestError: ${error.code}`);
  }

  return error;
}

const addErrorResponseSchema: onRouteHookHandler = async (opt) => {
  if (opt.schema?.hide) return;

  if (!opt.schema?.response) {
    throw new Error(
      `The property schema.response is missing on ${opt.method.toString()} ${opt.path}`,
    );
  }

  opt.schema.response = merge(
    {
      401: {
        ...ErrorResponse,
        "x-examples": {
          invalidPassword: {
            summary: "invalid password",
            description: "パスワードが間違っている",
            value: {
              statusCode: 401,
              error: "Unauthorized",
              message: "Invalid password",
            },
          },
        },
      },
      "400": {
        ...ErrorResponse,
        description: "不正なリクエスト",
      }, // from PrismaClientKnownRequestError
      "404": {
        ...ErrorResponse,
        description: "リソースが見つかりません",
        "x-examples": {
          notFound: {
            summary: "Not Found",
            description: "リソースが見つかりません",
            value: {
              statusCode: 404,
              error: "Not Found",
              message: "resource not found.",
            },
          },
        },
      }, // from Fastify default 404 handler, PrismaClientKnownRequestError
    },
    opt.schema.response,
  );
};

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("onRoute", addErrorResponseSchema);
  fastify.setErrorHandler(onPrismaClientKnownRequestError);
}

export default autohooks;
