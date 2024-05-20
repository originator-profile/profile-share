import { FastifyInstance, FastifyRequest, RouteOptions } from "fastify";
import Params from "./params";
import { ErrorResponse } from "../../../../error";

async function requiredGroupMembership({
  user,
  server,
  params,
  method,
}: FastifyRequest<{
  Params: Params;
}>) {
  // 審査担当者は会員のリソースを取得できる
  if (user.permissions.includes("write:reviews") && method === "GET") {
    return;
  }
  await server.services.userAccount.isMemberOfOrThrow({ id: user.sub }, params);
}

async function addErrorResponseSchema(opt: RouteOptions) {
  if (!opt.schema?.response) {
    throw new Error(
      `The property schema.response is missing on ${opt.method} ${opt.url}`,
    );
  }

  Object.assign(opt.schema.response, {
    403: ErrorResponse, // from requiredGroupMembership
    404: ErrorResponse, // from requiredGroupMembership
  });
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  // @ts-expect-error NOTE: **テスト用** 認証の無効化
  if (fastify.dangerouslyDisabledAuth) return;

  fastify.addHook("preHandler", requiredGroupMembership);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
