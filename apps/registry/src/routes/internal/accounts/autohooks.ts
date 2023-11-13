import { FastifyInstance, FastifyRequest, RouteOptions } from "fastify";
import { ForbiddenError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../error";

async function requiredSignUp({ user, server }: FastifyRequest) {
  const userAccount = await server.services.userAccount.read({ id: user.sub });
  if (userAccount instanceof Error) {
    throw new ForbiddenError("User activation is required.");
  }
}

async function addErrorResponseSchema(opt: RouteOptions) {
  if (!opt.schema?.response) {
    throw new Error(
      `The property schema.response is missing on ${opt.method} ${opt.url}`,
    );
  }

  Object.assign(opt.schema.response, {
    403: ErrorResponse,
  });
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  // @ts-expect-error NOTE: **テスト用** 認証の無効化
  if (fastify.dangerouslyDisabledAuth) return;

  fastify.addHook("preHandler", requiredSignUp);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
