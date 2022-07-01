import { PrismaClient, Prisma, websites } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { signBody } from "@webdino/profile-sign";

type Options = {
  prisma: PrismaClient;
};

export const WebsiteService = ({ prisma }: Options) => ({
  /**
   * ウェブページの作成
   * @param input ウェブページ
   * @return ウェブページ
   */
  async create(input: Prisma.websitesCreateInput): Promise<websites | Error> {
    return await prisma.websites.create({ data: input }).catch((e: Error) => e);
  },
  /**
   * ウェブページの表示
   * @param input.url ウェブページ URL
   * @return ウェブページ
   */
  async read({ url }: { url: string }): Promise<websites | Error> {
    const data = await prisma.websites
      .findUnique({ where: { url } })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },
  /**
   * ウェブページの更新
   * @param input ウェブページ
   * @return ウェブページ
   */
  async update(
    input: Prisma.websitesUpdateInput & { url: string }
  ): Promise<websites | Error> {
    return await prisma.websites.update({
      where: { url: input.url },
      data: input,
    });
  },
  /**
   * ウェブページの削除
   * @param input.url ウェブページ URL
   * @return ウェブページ
   */
  async delete({ url }: { url: string }): Promise<websites | Error> {
    return await prisma.websites.delete({ where: { url } });
  },
  /**
   * 対象のテキストへの署名
   * @param pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵
   * @param body 対象のテキスト
   * @return Detached Compact JWS
   */ async signBody(pkcs8: string, body: string): Promise<string | Error> {
    return await signBody(body, pkcs8).catch((e: Error) => e);
  },
});

export type WebsiteService = ReturnType<typeof WebsiteService>;
