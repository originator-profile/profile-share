import { FastifyInstance, onRouteHookHandler } from "fastify";
import basicAuth from "@fastify/basic-auth";
import helmet from "@fastify/helmet";
import { UnauthorizedError } from "http-errors-enhanced";
import { ErrorResponse } from "../../error";
import merge from "just-merge";

const addErrorResponseSchema: onRouteHookHandler = async (opt) => {
  if (!opt.schema?.response) {
    const method = [opt.method].flat().join();

    throw new Error(
      `The property schema.response is missing on ${method} ${opt.path}`,
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
    },
    opt.schema.response,
  );
};

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(basicAuth, {
    authenticate: { realm: "Profile Registry (Admin API)" },
    async validate(id, password, request) {
      const valid = await fastify.services.admin.auth(id, password);
      if (!valid) throw new UnauthorizedError("Invalid password");
      request.accountId = id;
    },
  });
  fastify.after(() => fastify.addHook("onRequest", fastify.basicAuth));
  fastify.register(helmet, {
    hsts: { preload: true },
  });
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
