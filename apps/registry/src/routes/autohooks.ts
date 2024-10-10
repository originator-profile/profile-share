import basicAuth from "@fastify/basic-auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  FastifyError,
  FastifyInstance,
  FastifyRequest,
  onRouteHookHandler,
} from "fastify";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "http-errors-enhanced";
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
      `The property schema.response is missing on ${opt.method} ${opt.path}`,
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

  // @ts-expect-error NOTE: **テスト用** 認証の無効化
  if (fastify.config.BASIC_AUTH && !fastify.dangerouslyDisabledAuth) {
    // NOTE: カプセル化してデコレータの競合を避ける
    await fastify.register(async function (child: FastifyInstance) {
      await child.register(basicAuth, {
        authenticate: { realm: "Profile Registry (Entire Routes)" },
        async validate(username, password, request) {
          if (request.routeOptions.url?.startsWith("/admin/")) return;
          if (
            !(
              username === child.config.BASIC_AUTH_USERNAME &&
              password === child.config.BASIC_AUTH_PASSWORD
            )
          )
            throw new UnauthorizedError("Invalid password");
        },
      });

      fastify.addHook("onRequest", child.basicAuth);
    });
  }
}

export default autohooks;
