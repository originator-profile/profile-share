import { FastifyInstance, FastifyRequest, RouteOptions } from "fastify";
import Params from "./params";
import { ErrorResponse } from "../../../../error";

async function requiredReviewerMembership(
  req: FastifyRequest<{ Params: Params }>,
) {
  if (req.user.sub !== req.params.id) {
    await req.server.services.userAccount.reviewerMembershipOrThrow({
      id: req.user.sub,
      reviewerId: req.params.id,
    });
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
  fastify.addHook("preHandler", requiredReviewerMembership);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
