import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";

const Body = {
  type: "object",
  properties: {
    image: {
      title: "画像（ base64url でエンコード）",
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
    400: ErrorResponse,
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
