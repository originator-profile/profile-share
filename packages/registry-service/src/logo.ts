import { logos } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { getClient } from "@originator-profile/registry-db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Config from "./config";
import sizeof from "image-size";
import crypto from "node:crypto";
import path from "node:path";

type Options = {
  config: Config;
};

type AccountId = string;

export const LogoService = ({ config }: Options) => ({
  /**
   * ロゴの取得
   * @param input.id 会員 ID
   * @throws {NotFoundError} ロゴが見つからない
   * @return ロゴの情報
   */
  async readMainLogo({ id }: { id: AccountId }): Promise<logos> {
    const prisma = getClient();
    const data = await prisma.logos.findFirst({
      where: { accountId: id, isMain: true },
    });

    if (!data) {
      throw new NotFoundError("Logo not found.");
    }

    return data;
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
    image: Buffer;
  }): Promise<logos> {
    this.raiseIfTooSmallImage(image);

    const s3 = new S3Client({
      region: "auto",
      endpoint: config.S3_API_ENDPOINT,
      credentials: {
        accessKeyId: `${config.S3_ACCESS_KEY_ID}`,
        secretAccessKey: `${config.S3_SECRET_ACCESS_KEY}`,
      },
      // minio のために設定。 R2 の場合値関係なく動作している
      forcePathStyle: true,
    });

    const checksum = crypto.createHash("sha256").update(image).digest("hex");
    const extension = path.extname(fileName);
    const newFileName = `${checksum}${extension}`;

    const command = new PutObjectCommand({
      Bucket: config.S3_ACCOUNT_LOGO_BUCKET_NAME,
      Key: `${id}/${newFileName}`,
      Body: image,
    });

    await s3.send(command);

    const url = this.makeUrl(id, newFileName);

    const newLogo = await this.upsertMainLogo(id, { url });

    return newLogo;
  },

  /**
   * メインロゴの登録・更新 (upsert)
   * @param id 会員 ID
   * @param data ロゴのメタデータ
   * @return 更新後のメタデータ
   */
  async upsertMainLogo(id: AccountId, data: { url: string }): Promise<logos> {
    const prisma = getClient();
    const oldLogo = await prisma.logos.findFirst({
      where: { accountId: id, isMain: true },
    });

    if (oldLogo) {
      return await prisma.logos.update({
        where: { accountId: id, url: oldLogo.url },
        data: { url: data.url },
      });
    } else {
      return await prisma.logos.create({
        data: { accountId: id, url: data.url, isMain: true },
      });
    }
  },
  /**
   * ロゴ画像をインターネットに公開する際の URL を生成する
   * @param id アカウントID
   * @param fileName ファイル名
   * @return URL
   */
  makeUrl(id: AccountId, fileName: string): string {
    return `${config.S3_ACCOUNT_LOGO_PUBLIC_ENDPOINT}/${id}/${fileName}`;
  },
  /**
   * 画像のサイズを検証して、小さすぎる場合は例外を投げる
   * @throws {BadRequestError} 画像サイズの検出失敗/画像サイズが規定より小さい
   * @param image 画像（対応画像形式は image-size ライブラリと同じ）
   */
  raiseIfTooSmallImage(image: Buffer): void {
    const { width, height } = sizeof(image);
    if (!width || !height) {
      throw new BadRequestError("Cannot detect image size");
    }
    if (width < 396 || height < 396) {
      throw new BadRequestError(
        `too small image (width: ${width}, height: ${height})`,
      );
    }
  },
});

export type LogoService = ReturnType<typeof LogoService>;
