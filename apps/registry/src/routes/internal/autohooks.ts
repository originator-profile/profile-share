import {
  FastifyError,
  FastifyInstance,
  FastifyRequest,
  onRouteHookHandler,
} from "fastify";
import helmet from "@fastify/helmet";
import auth0Verify from "fastify-auth0-verify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError, ForbiddenError } from "http-errors-enhanced";
import { ErrorResponse } from "../../error";

async function requiredPermissions(request: FastifyRequest) {
  const user = request.user;
  if (!user.permissions.includes("write:requests")) {
    throw new ForbiddenError("Insufficient permissions");
  }
}

function onPrismaClientKnownRequestError(error: FastifyError) {
  if (error instanceof PrismaClientKnownRequestError) {
    return new BadRequestError(error.message);
  }

  return error;
}

const addErrorResponseSchema: onRouteHookHandler = async (opt) => {
  if (!opt.schema?.response) {
    const method = [opt.method].flat().join();

    throw new Error(
      `The property schema.response is missing on ${method} ${opt.path}`,
    );
  }

  Object.assign(opt.schema.response, {
    400: ErrorResponse,
    401: ErrorResponse,
    403: ErrorResponse,
  });
};

async function autohooks(fastify: FastifyInstance): Promise<void> {
  // @ts-expect-error NOTE: **テスト用** 認証の無効化
  if (fastify.dangerouslyDisabledAuth) return;

  fastify.register(auth0Verify, {
    domain: fastify.config.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com",
    audience: fastify.config.APP_URL ?? "http://localhost:8080/",
  });
  fastify.after(() => {
    fastify.addHook("onRequest", fastify.authenticate);
    fastify.addHook("preHandler", requiredPermissions);
  });
  fastify.register(helmet, {
    hsts: { preload: true },
  });
  fastify.addHook("onRoute", addErrorResponseSchema);
  fastify.setErrorHandler(onPrismaClientKnownRequestError);
}

export default autohooks;
