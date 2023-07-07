import { PrismaClient, Prisma, websites } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { NotFoundError } from "http-errors-enhanced";
import { signBody } from "@webdino/profile-sign";
import { v4 as uuid4, validate } from "uuid";

type Options = {
  prisma: PrismaClient;
};

export interface Website {
  id: string;
  url: string;
  title?: string | null;
  image?: string | null;
  description?: string | null;
  author?: string | null;
  editor?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  location?: string | null;
  proofJws: string;
  accountId: string;
  categories?: Array<{ cat: string; cattax?: number }>;
  bodyFormat: string;
}

/**
 * category の配列を受け取って、 prisma の update() や create() に渡せる形式にします。
 * @param categories category の配列
 * @param websiteId ウェブページの ID
 * @return connectOrCreate プロパティに渡せる値
 */
const convertCategoriesToPrismaConnectOrCreate = (
  categories: Website["categories"],
  websiteId: Website["id"],
): Prisma.websiteCategoriesCreateNestedManyWithoutWebsiteInput | undefined => {
  if (typeof categories === "undefined") {
    return undefined;
  }

  const categoriesConnect = categories?.map((c) => {
    return {
      where: {
        websiteId_categoryCat_categoryCattax: {
          websiteId: websiteId,
          categoryCat: c.cat,
          categoryCattax: c.cattax || 1,
        },
      },
      create: { categoryCat: c.cat, categoryCattax: c.cattax || 1 },
    };
  });
  return { connectOrCreate: categoriesConnect };
};

export const WebsiteService = ({ prisma }: Options) => ({
  /**
   * ウェブページの作成
   * @param website ウェブページ (webpage.id を省略した場合: UUID v4 生成)
   * @return 作成したウェブページ
   */
  async create(
    website: Omit<Website, "id"> & { id?: Website["id"] },
  ): Promise<websites | Error> {
    const {
      categories,
      bodyFormat,
      accountId,
      id = uuid4(),
      ...createInput
    } = website;

    if (
      bodyFormat !== "text" &&
      bodyFormat !== "visibleText" &&
      bodyFormat !== "html"
    ) {
      throw new Error("invalid bodyFormat");
    }

    const input = {
      account: {
        connect: { id: accountId },
      },
      bodyFormat: {
        connect: { value: bodyFormat },
      },
      categories: convertCategoriesToPrismaConnectOrCreate(categories, id),
      ...createInput,
    } as const satisfies Prisma.websitesCreateInput;
    return await prisma.websites
      .create({
        data: input,
        include: { categories: true },
      })
      .catch((e: Error) => e);
  },

  /**
   * @deprecated
   * ウェブページの作成
   * @param input ウェブページ
   * @return ウェブページ
   */
  async createForOldAPI(
    input: Prisma.websitesCreateInput,
  ): Promise<websites | Error> {
    return await prisma.websites
      .create({
        data: input,
        include: { categories: true },
      })
      .catch((e: Error) => e);
  },
  /**
   * ウェブページの表示
   * @param input.id ウェブページ ID
   * @return ウェブページ
   */
  async read({ id }: { id: string }): Promise<websites | Error> {
    const data = await prisma.websites
      .findUnique({
        where: { id },
        include: { categories: true },
      })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },
  /**
   * ウェブページの更新
   * @param website ウェブページ (webpage.id 必須)
   * @return ウェブページ
   */
  async update(website: Website): Promise<websites | Error> {
    const { categories, bodyFormat, accountId, id, ...rest } = website;

    if (!id) {
      return new Error("website.id is required.");
    }

    // 該当する website がないか、紐づいている account が違う場合はエラーを返す。
    const recordToUpdate = await prisma.websites.findFirst({
      where: { id, accountId },
    });
    if (!recordToUpdate) {
      return new NotFoundError("Not Found");
    }

    const connectBodyFormat =
      typeof bodyFormat === "undefined"
        ? undefined
        : {
            connect: { value: bodyFormat },
          };

    const input = {
      bodyFormat: connectBodyFormat,
      categories: convertCategoriesToPrismaConnectOrCreate(categories, id),
      ...rest,
    } satisfies Prisma.websitesUpdateInput;

    return await prisma.websites
      .update({
        where: { id: id },
        data: input,
        include: { categories: true },
      })
      .catch((e: Error) => e);
  },

  /**
   * @deprecated
   * ウェブページの更新
   * @param input ウェブページ
   * @return ウェブページ
   */
  async updateForOldAPI(
    input: Prisma.websitesUpdateInput & { id: string },
  ): Promise<websites | Error> {
    return await prisma.websites.update({
      where: { id: input.id },
      data: input,
      include: { categories: true },
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
   * @param pkcs8 PEM base64 でエンコードされた PKCS #8 プライベート鍵
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
      | string = "https://originator-profile.org/context.jsonld",
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
          account.publications.map((publication) => publication.op.jwt),
        ),
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
      | string = "https://originator-profile.org/context.jsonld",
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
