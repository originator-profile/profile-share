import basicAuth from "@fastify/basic-auth";
import { FastifyInstance, onRouteHookHandler } from "fastify";
import { UnauthorizedError } from "http-errors-enhanced";
import merge from "just-merge";
import { ErrorResponse } from "../../error";

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
  await fastify.register(basicAuth, {
    authenticate: { realm: "Profile Registry" },
    async validate(id, password, request) {
      const valid = await fastify.services.admin.auth(id, password);
      if (!valid) throw new UnauthorizedError("Invalid password");
      request.accountId = id;
    },
  });

  fastify.addHook("onRequest", fastify.basicAuth);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
