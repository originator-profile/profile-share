import { FastifySchema, FastifyRequest } from "fastify";
import { createError } from "http-errors-enhanced";
import { User } from "@originator-profile/model";

const schema: FastifySchema = {
  description: "ユーザーアカウントの更新・作成",
  tags: ["user-accounts"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      title: "ユーザーアカウント",
      description: "作成・更新されたユーザーアカウント",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function upsert(req: FastifyRequest) {
  const accessToken = req.server.jwt.lookupToken(req);
  const userinfoResponse = await fetch(
    `https://${
      req.server.config.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com"
    }/userinfo`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const userinfoResponseBody: unknown = await userinfoResponse.json();

  if (!userinfoResponse.ok) {
    throw createError(
      userinfoResponse.status,
      userinfoResponse.statusText,
      userinfoResponseBody as object,
    );
  }

  const userinfo = userinfoResponseBody as {
    sub: string;
    name: string;
    email: string;
    picture: string;
  };

  const user = {
    id: userinfo.sub,
    name: userinfo.name,
    email: userinfo.email,
    picture: userinfo.picture,
  } satisfies User;

  return await req.server.services.userAccount.upsert(user);
}

export { upsert, schema };
