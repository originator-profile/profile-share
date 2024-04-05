import { FastifyInstance, FastifyRequest, RouteOptions } from "fastify";
import { ErrorResponse } from "../../../error";

async function requiredSignUp({ user, server }: FastifyRequest) {
  await server.services.userAccount.signedUpOrThrow({ id: user.sub });
}

async function addErrorResponseSchema(opt: RouteOptions) {
  if (!opt.schema?.response) {
    throw new Error(
      `The property schema.response is missing on ${opt.method} ${opt.url}`,
    );
  }

  Object.assign(opt.schema.response, {
    403: ErrorResponse, // from requiredSignUp
  });
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", requiredSignUp);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
