import { PrismaClient, Prisma, websites } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { NotFoundError } from "http-errors-enhanced";
import { signBody } from "@webdino/profile-sign";
import { validate } from "uuid";

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
   * @param input.id ウェブページ ID
   * @return ウェブページ
   */
  async read({ id }: { id: string }): Promise<websites | Error> {
    const data = await prisma.websites
      .findUnique({ where: { id } })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },
  /**
   * ウェブページの更新
   * @param input ウェブページ
   * @return ウェブページ
   */
  async update(
    input: Prisma.websitesUpdateInput & { id: string }
  ): Promise<websites | Error> {
    return await prisma.websites.update({
      where: { id: input.id },
      data: input,
    });
  },
  /**
   * ウェブページの削除
   * @param input.id ウェブページ ID
   * @return ウェブページ
   */
  async delete({ id }: { id: string }): Promise<websites | Error> {
    return await prisma.websites.delete({ where: { id } });
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
   * Profile Set の取得
   * @param url ウェブページのURL
   * @param contextDefinition https://www.w3.org/TR/json-ld11/#context-definitions
   */
  async getProfileSet(
    url: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld"
  ): Promise<JsonLdDocument | Error> {
    const data = await prisma.websites
      .findMany({
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
    if (data instanceof Error) return data;
    if (data.length === 0) return new NotFoundError();

    const sops = [
      ...new Set(
        data.flatMap(({ account }) =>
          account.publications.map((publication) => publication.op.jwt)
        )
      ),
    ];
    const sdps = data.flatMap(({ dps }) => dps.map((dp) => dp.jwt));
    const profiles: JsonLdDocument = {
      "@context": contextDefinition,
      profile: [...sops, ...sdps],
    };
    return profiles;
  },
  /**
   * 特定のウェブページ ID の Profile Set の取得
   * @param id ウェブページ ID または URL (非推奨)
   * @param contextDefinition https://www.w3.org/TR/json-ld11/#context-definitions
   */
  async getDocumentProfileSet(
    id: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld"
  ): Promise<JsonLdDocument | Error> {
    const data = await prisma.websites
      .findFirstOrThrow({
        where: validate(id) ? { id } : { url: id },
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
      "@context": contextDefinition,
      main: data.id,
      profile: [...ops, ...data.dps].map((p) => p.jwt),
    };
    return profiles;
  },
});

export type WebsiteService = ReturnType<typeof WebsiteService>;
