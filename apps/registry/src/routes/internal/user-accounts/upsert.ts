import { FastifySchema, FastifyRequest } from "fastify";
import { BadRequestError } from "http-errors-enhanced";
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
  },
};

async function upsert(req: FastifyRequest<{ Body: Body }>) {
  const accessToken = req.server.jwt.lookupToken(req);
  const userinfoResponse = await fetch(
    `https://${
      req.server.config.AUTH0_DOMAIN ?? "oprdev.jp.auth0.com"
    }/userinfo`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const userinfo = (await userinfoResponse.json()) as unknown as {
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
    req.server.log.error(data.message);
    throw new BadRequestError("Invalid request");
  }
  return data;
}

export { upsert, schema };
