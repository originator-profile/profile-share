import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import {
  ProxyAuthenticationRequiredError,
  InternalServerError,
  BadRequestError,
} from "http-errors-enhanced";
import { ErrorResponse } from "../../../error";
import { User } from "@originator-profile/model";

const schema: FastifySchema = {
  description: "ユーザーアカウントの更新・作成",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      title: "ユーザーアカウント",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    407: ErrorResponse,
    500: ErrorResponse,
  },
};

async function upsert(
  { server, headers }: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply,
) {
  if (!headers.authorization) {
    reply.header("Proxy-Authenticate", 'Bearer realm="Access Token"');
    throw new ProxyAuthenticationRequiredError();
  }
  const userinfo:
    | { sub: string; name: string; email: string; picture: string }
    | Error = await fetch(
    `https://${server.config.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com"}/userinfo`,
    { headers: { Authorization: headers.authorization } },
  )
    .then((res) => res.json())
    .catch((e) => e);
  if (userinfo instanceof Error) throw new InternalServerError();

  const user: User = {
    id: userinfo.sub,
    name: userinfo.name,
    email: userinfo.email,
    picture: userinfo.picture,
  };

  const data = await server.services.userAccount.upsert(user);
  if (data instanceof Error) {
    console.error(data.message);
    throw new BadRequestError("Invalid request");
  }
  return data;
}

export { upsert, schema };
