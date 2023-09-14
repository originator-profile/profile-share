import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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
  security: [],
  response: {
    200: {
      title: "ロゴ",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    403: ErrorResponse,
  },
};

async function create({
  server,
  body,
  params,
}: FastifyRequest<{
  Body: Body;
  Params: Params;
}>) {
  const { id } = params;
  const { image, fileName } = body;

  const s3 = new S3Client({
    region: "auto",
    endpoint: server.config.MINIO_ENDPOINT,
    credentials: {
      accessKeyId: `${server.config.MINIO_ROOT_USER}`,
      secretAccessKey: `${server.config.MINIO_ROOT_PASSWORD}`,
    },
    // TODO: R2 を使う場合に true でいいか確認して
    forcePathStyle: true,
  });

  const mainLogo = await server.services.account.readMainLogo({ id });
  if (mainLogo instanceof Error) throw new BadRequestError("Invalid request");

  if (!(mainLogo instanceof NotFoundError)) {
    // 古いメインロゴが R2 にある場合は削除する
    const components = mainLogo.url.split("/");
    const oldKey = `${components[components.length - 2]}/${
      components[components.length - 1]
    }`;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: server.config.MINIO_ACCOUNT_LOGO_BUCKET_NAME,
      Key: oldKey,
    });
    await s3.send(deleteCommand);
    // TODO result の検証
    server.log.info(deleteResult);
  }

  const command = new PutObjectCommand({
    Bucket: server.config.MINIO_ACCOUNT_LOGO_BUCKET_NAME,
    Key: `${id}/${fileName}`,
    Body: Buffer.from(image, "base64url"),
  });
  await s3.send(command);
  // TODO result の検証
  server.log.info(result);

  // TODO: public access 用の R2 の URL にして
  const url = `${server.config.MINIO_ENDPOINT}/${server.config.MINIO_ACCOUNT_LOGO_BUCKET_NAME}/${id}/${fileName}`;

  const newLogo = await server.services.account.upsertMainLogo(id, { url });
  if (newLogo instanceof Error) throw new BadRequestError("Invalid request");

  return newLogo;
}

export { create, schema };
