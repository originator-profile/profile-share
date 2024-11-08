import { FastifyInstance, FastifyRequest, onRouteHookHandler } from "fastify";
import auth0Verify from "fastify-auth0-verify";
import { ForbiddenError } from "http-errors-enhanced";
import { ErrorResponse } from "../../error";

async function requiredPermissions(request: FastifyRequest) {
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
  opt.schema.tags = ["internal", ...(opt.schema.tags ?? [])];

  Object.assign(opt.schema.response, {
    // 400: from fastify-auth0-verify, injected by src/routes/autohooks.ts
    401: {
      ...ErrorResponse,
      "x-examples": {
        invalidPassword: {
          summary: "access token missing",
          description: "アクセストークンがない",
          value: {
            statusCode: 401,
            error: "Unauthorized",
            message: "Missing Authorization HTTP header",
          },
        },
      },
    }, // from fastify-auth0-verify
    403: {
      ...ErrorResponse,
      "x-examples": {
        insufficientPermission: {
          summary: "insufficient permission",
          description: "権限が不足している",
          value: {
            statusCode: 403,
            error: "Forbidden",
            message: "Insufficient permissions",
          },
        },
      },
    }, // from requiredPermissions
    500: {
      ...ErrorResponse,
      "x-examples": {
        unavailableAuthorizationServer: {
          summary: "unavailable authorization server",
          description: "認可サーバーとの通信に失敗",
          value: {
            statusCode: 500,
            error: "Internal Server Error",
            message:
              'Unable to get the JWS due to a HTTP error: [HTTP 404] {"error":"Not found."}',
          },
        },
      },
    }, // from fastify-auth0-verify
  });
};

async function autohooks(fastify: FastifyInstance): Promise<void> {
  // @ts-expect-error NOTE: **テスト用** 認証の無効化
  if (fastify.dangerouslyDisabledAuth) return;

  await fastify.register(auth0Verify, {
    domain: fastify.config.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com",
    audience: fastify.config.APP_URL ?? "http://localhost:8080/",
  });

  fastify.addHook("onRequest", fastify.authenticate);
  fastify.addHook("preHandler", requiredPermissions);
  fastify.addHook("onRoute", addErrorResponseSchema);
}

export default autohooks;
