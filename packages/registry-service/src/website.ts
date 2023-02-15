import { PrismaClient, Prisma, websites } from "@prisma/client";
import { JsonLdDocument } from "jsonld";
import { NotFoundError } from "http-errors-enhanced";
import { signBody } from "@webdino/profile-sign";
import Config from "./config";

type Options = {
  config: Config;
  prisma: PrismaClient;
};

export const WebsiteService = ({ config, prisma }: Options) => ({
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
  /**
   * Profiles Set の取得
   * @param url ウェブページ URL
   */
  async getProfiles(url: string): Promise<JsonLdDocument | Error> {
    const data = await prisma.websites
      .findUnique({
        where: { url },
        include: {
          account: {
            include: {
              publications: {
                include: {
                  op: true,
                },
                orderBy: {
                  publishedAt: "desc",
                },
                take: 1,
              },
            },
          },
          dps: {
            orderBy: {
              issuedAt: "desc",
            },
            take: 1,
          },
        },
      })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;
    if (data.dps.length === 0) return new NotFoundError();
    if (data.account.publications.length === 0) return new NotFoundError();

    const ops = data.account.publications.map((publication) => publication.op);
    const profiles: JsonLdDocument = {
      "@context": `${
        config.APP_URL ?? Config.properties.APP_URL.default
      }/context`,
      main: data.url,
      profile: [...ops, ...data.dps].map((p) => p.jwt),
    };
    return profiles;
  },
});

export type WebsiteService = ReturnType<typeof WebsiteService>;
