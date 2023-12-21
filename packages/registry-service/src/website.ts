import { Prisma, websites } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { signBody } from "@originator-profile/sign";
import { Jwk } from "@originator-profile/model";
import {
  Website,
  WebsiteCreate,
  WebsiteUpdate,
  WebsiteRepository,
  getClient,
} from "@originator-profile/registry-db";

type Options = {
  websiteRepository: WebsiteRepository;
};

export type { Website };

export const WebsiteService = ({ websiteRepository }: Options) => ({
  /**
   * ウェブページの作成
   * @param website ウェブページ (website.id を省略した場合: UUID v4 生成)
   * @return 作成したウェブページ
   */
  async create(website: WebsiteCreate): Promise<websites | Error> {
    return await websiteRepository.create(website);
  },

  /**
   * ウェブページの作成
   * @param input ウェブページ
   * @return ウェブページ
   *
   * @deprecated 代わりに {@link create} を利用してください。
   */
  async createForOldAPI(
    input: Prisma.websitesCreateInput,
  ): Promise<websites | Error> {
    const prisma = getClient();
    const { url, ...rest } = input;
    return await prisma.websites
      .create({
        data: {
          url: websiteRepository.serializeUrl(url),
          ...rest,
        },
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
    return await websiteRepository.read({ id });
  },

  /**
   * ウェブページの更新
   * @param website ウェブページ (website.id 必須)
   * @return ウェブページ
   */
  async update(website: WebsiteUpdate): Promise<websites | Error> {
    return await websiteRepository.update(website);
  },

  /**
   * ウェブページの更新
   * @param input ウェブページ
   * @return ウェブページ
   *
   * @deprecated 代わりに {@link update} を利用してください。
   */
  async updateForOldAPI(
    input: Prisma.websitesUpdateInput & { id: string },
  ): Promise<websites | Error> {
    const prisma = getClient();
    const { id, url, ...rest } = input;
    let serialized;
    if (typeof url === "undefined") {
      serialized = undefined;
    } else if (typeof url === "string") {
      serialized = websiteRepository.serializeUrl(url);
    } else if (url?.set) {
      serialized = {
        set: websiteRepository.serializeUrl(url.set),
      };
    }
    return await prisma.websites.update({
      where: { id },
      data: { url: serialized, ...rest },
      include: { categories: true },
    });
  },

  /**
   * ウェブページの削除
   * @param input.id ウェブページ ID
   * @return ウェブページ
   */
  async delete({ id }: { id: string }): Promise<websites | Error> {
    return await websiteRepository.delete({ id });
  },

  /**
   * 対象のテキストへの署名
   * @param privateKey プライベート鍵
   * @param body 対象のテキスト
   * @return Detached Compact JWS
   */ async signBody(privateKey: Jwk, body: string): Promise<string | Error> {
    return await signBody(body, privateKey).catch((e: Error) => e);
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
    main?: string,
  ): Promise<JsonLdDocument | Error> {
    return websiteRepository.getProfileSet(url, contextDefinition, main);
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
    return await websiteRepository.getDocumentProfileSet(id, contextDefinition);
  },
});

export type WebsiteService = ReturnType<typeof WebsiteService>;
