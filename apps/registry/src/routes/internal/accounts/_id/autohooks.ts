import { FastifyInstance, FastifyRequest, RouteOptions } from "fastify";
import { ForbiddenError, NotFoundError } from "http-errors-enhanced";
import Params from "./params";
import { ErrorResponse } from "../../../../error";

async function requiredGroupMembership({
  user,
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  const userAccount = await server.services.userAccount.read({ id: user.sub });
  if (userAccount instanceof Error) {
    throw new ForbiddenError("User activation is required.");
  }
  if (userAccount.accountId !== params.id) {
    throw new NotFoundError("Group not found.");
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
    404: ErrorResponse,
  });
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", requiredGroupMembership);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
