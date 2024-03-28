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
  /** {@link WebsiteRepository.create} */
  async create(website: WebsiteCreate): Promise<websites> {
    return await websiteRepository.create(website);
  },

  /**
   * ウェブページの作成
   * @param input ウェブページ
   * @return ウェブページ
   *
   * @deprecated 代わりに {@link create} を利用してください。
   */
  async createForOldAPI(input: Prisma.websitesCreateInput): Promise<websites> {
    const prisma = getClient();
    const { url, ...rest } = input;
    return await prisma.websites.create({
      data: {
        url: websiteRepository.serializeUrl(url),
        ...rest,
      },
      include: { categories: true },
    });
  },

  /** {@link WebsiteRepository.read} */
  async read({ id }: { id: string }): Promise<websites> {
    return await websiteRepository.read({ id });
  },

  /** {@link WebsiteRepository.update} */
  async update(website: WebsiteUpdate): Promise<websites> {
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
  ): Promise<websites> {
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

  /** {@link WebsiteRepository.delete} */
  async delete({ id }: { id: string }): Promise<websites> {
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

  /** {@link WebsiteRepository.getProfileSet} */
  async getProfileSet(
    url: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld",
    main?: string,
  ): Promise<JsonLdDocument> {
    return await websiteRepository.getProfileSet(url, contextDefinition, main);
  },

  /** {@link WebsiteRepository.getDocumentProfileSet} */
  async getDocumentProfileSet(
    id: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld",
  ): Promise<JsonLdDocument> {
    return await websiteRepository.getDocumentProfileSet(id, contextDefinition);
  },
});

export type WebsiteService = ReturnType<typeof WebsiteService>;
