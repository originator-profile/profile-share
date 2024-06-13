import { FastifySchema, FastifyRequest } from "fastify";
import Params from "../params";

export const method = "GET";
export const url = "/";

export const schema = {
  params: Params,
  description: "アカウントの資格情報一覧の取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "資格情報のリスト",
      type: "array",
      items: {
        type: "object",
        title: "資格情報",
        additionalProperties: true,
      },
    },
  },
} as const satisfies FastifySchema;

export async function handler({
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  const { id } = params;

  return await server.services.credential.read(id);
}
