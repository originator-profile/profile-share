import { logos } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { getClient } from "@originator-profile/registry-db";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import Config from "./config";

type Options = {
  config: Config;
};

type AccountId = string;

export const LogoService = ({ config }: Options) => ({
  /**
   * ロゴの取得
   * @param input.id 会員 ID
   * @return ロゴの情報
   */
  async readMainLogo({ id }: { id: AccountId }): Promise<logos | Error> {
    const prisma = getClient();
    const data = await prisma.logos
      .findFirst({ where: { accountId: id, isMain: true } })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },

  /**
   * ロゴのアップロード
   * @param input.id 会員ID
   * @param input.fileName ファイル名
   * @param input.image 画像（バイナリデータにデコード済み）
   * @return ロゴの情報
   */
  async uploadLogo({
    id,
    fileName,
    image,
  }: {
    id: string;
    fileName: string;
    image: PutObjectCommandInput["Body"];
  }) {
    const s3 = new S3Client({
      region: "auto",
      endpoint: config.MINIO_ENDPOINT,
      credentials: {
        accessKeyId: `${config.MINIO_ROOT_USER}`,
        secretAccessKey: `${config.MINIO_ROOT_PASSWORD}`,
      },
      // minio のために設定。 R2 の場合値関係なく動作している
      forcePathStyle: true,
    });

    const mainLogo = await this.readMainLogo({ id });
    if (mainLogo instanceof Error) throw new BadRequestError("Invalid request");

    if (!(mainLogo instanceof NotFoundError)) {
      // 古いメインロゴが R2 にある場合は削除する
      const components = mainLogo.url.split("/");
      const oldKey = `${components[components.length - 2]}/${
        components[components.length - 1]
      }`;

      const deleteCommand = new DeleteObjectCommand({
        Bucket: config.MINIO_ACCOUNT_LOGO_BUCKET_NAME,
        Key: oldKey,
      });
      await s3.send(deleteCommand);
    }

    const command = new PutObjectCommand({
      Bucket: config.MINIO_ACCOUNT_LOGO_BUCKET_NAME,
      Key: `${id}/${fileName}`,
      Body: image,
    });

    await s3.send(command);

    // TODO: public access 用の R2 の URL にして
    const url = `${config.MINIO_ENDPOINT}/${config.MINIO_ACCOUNT_LOGO_BUCKET_NAME}/${id}/${fileName}`;

    const newLogo = await this.upsertMainLogo(id, { url });
    if (newLogo instanceof Error) throw new BadRequestError("Invalid request");

    return newLogo;
  },

  /**
   * メインロゴの登録・更新 (upsert)
   * @param id 会員 ID
   * @param data ロゴのメタデータ
   * @return 更新後のメタデータ
   */
  async upsertMainLogo(id: AccountId, data: { url: string }) {
    const prisma = getClient();
    const oldLogo = await prisma.logos.findFirst({
      where: { accountId: id, isMain: true },
    });

    if (oldLogo) {
      return await prisma.logos
        .update({
          where: { accountId: id, url: oldLogo.url },
          data: { url: data.url },
        })
        .catch((e: Error) => e);
    } else {
      return await prisma.logos
        .create({
          data: { accountId: id, url: data.url, isMain: true },
        })
        .catch((e: Error) => e);
    }
  },
});

export type LogoService = ReturnType<typeof LogoService>;
