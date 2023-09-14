import { FastifyInstance, FastifyRequest, onRouteHookHandler } from "fastify";
import helmet from "@fastify/helmet";
import auth0Verify from "fastify-auth0-verify";
import { ForbiddenError } from "http-errors-enhanced";
import { ErrorResponse } from "../../error";

export async function preHandler(request: FastifyRequest) {
  const user = request.user;
  if (!user.permissions.includes("write:requests")) {
    throw new ForbiddenError("Insufficient permissions");
  }
}

const addErrorResponseSchema: onRouteHookHandler = async (opt) => {
  if (!opt.schema?.response) {
    const method = [opt.method].flat().join();

    throw new Error(
      `The property schema.response is missing on ${method} ${opt.path}`,
    );
  }

  Object.assign(opt.schema.response, {
    401: ErrorResponse,
    403: ErrorResponse,
  });
};

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(auth0Verify, {
    domain: fastify.config.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com",
    audience: fastify.config.APP_URL ?? "http://localhost:8080/",
  });
  fastify.after(() => {
    fastify.addHook("onRequest", fastify.authenticate);
    fastify.addHook("preHandler", preHandler);
  });
  fastify.register(helmet, {
    hsts: { preload: true },
  });
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
