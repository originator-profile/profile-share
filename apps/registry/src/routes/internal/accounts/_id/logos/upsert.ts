import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import Params from "./params";

const Body = {
  type: "object",
  properties: {
    image: {
      title: "画像（ base64url でエンコード）",
      description:
        "画像データを base64url でエンコードして文字列として与えてください（ `=` のパディング不要）。画像データはエンコード前のサイズでおおよそ 7.5MB まで受け付けます。リクエストの body 全体で 10MiB を超える場合には、 413 エラーレスポンスを返します。 https://fastify.dev/docs/latest/Reference/Server/#bodylimit",
      type: "string",
    },
    fileName: {
      title: "ファイル名",
      type: "string",
    },
  },
  required: ["image", "fileName"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  body: Body,
  params: Params,
  description: "ロゴの登録・更新",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "ロゴ",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function upsert({
  server,
  body,
  params,
}: FastifyRequest<{
  Body: Body;
  Params: Params;
}>) {
  const { id } = params;
  const { image, fileName } = body;

  const imageBuffer = Buffer.from(image, "base64url");
  if (imageBuffer.toString("base64url") !== image) {
    throw new BadRequestError("invalid image");
  }

  const newLogo = await server.services.logo.uploadLogo({
    id,
    fileName,
    image: imageBuffer,
  });

  return newLogo;
}

export { upsert, schema };
