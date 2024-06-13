import { FastifyInstance, FastifyRequest, RouteOptions } from "fastify";
import Params from "./params";
import { ErrorResponse } from "../../../../error";
import { ForbiddenError } from "http-errors-enhanced";

async function requiredRoleCertifier(req: FastifyRequest<{ Params: Params }>) {
  if (req.user.sub !== req.params.id) {
    const user = req.user;
    if (!user.permissions.includes("write:reviews")) {
      throw new ForbiddenError("Insufficient permissions");
    }
  }
}

async function addErrorResponseSchema(opt: RouteOptions) {
  if (!opt.schema?.response) {
    throw new Error(
      `The property schema.response is missing on ${opt.method} ${opt.url}`,
    );
  }

  Object.assign(opt.schema.response, {
    404: ErrorResponse, // from requiredReviewerMembership
  });
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", requiredRoleCertifier);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
