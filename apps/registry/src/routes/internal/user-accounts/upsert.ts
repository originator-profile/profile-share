import { FastifySchema, FastifyRequest } from "fastify";
import { BadRequestError, createError } from "http-errors-enhanced";
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

  const user: User = {
    id: userinfo.sub,
    name: userinfo.name,
    email: userinfo.email,
    picture: userinfo.picture,
  };

  const data = await req.server.services.userAccount.upsert(user);
  if (data instanceof Error) {
    req.server.log.info(data.message);
    throw new BadRequestError("Invalid request");
  }
  return data;
}

export { upsert, schema };
