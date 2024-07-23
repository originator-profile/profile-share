import {
  Website,
  WebsiteCreate,
  WebsiteRepository,
  WebsiteUpdate,
} from "@originator-profile/registry-db";
import { websites } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";

type Options = {
  websiteRepository: WebsiteRepository;
};

export type { Website };

export const WebsiteService = ({ websiteRepository }: Options) => ({
  /** {@link WebsiteRepository.create} */
  async create(website: WebsiteCreate): Promise<websites> {
    return await websiteRepository.create(website);
  },

  /** {@link WebsiteRepository.read} */
  async read({ id }: { id: string }): Promise<websites> {
    return await websiteRepository.read({ id });
  },

  /** {@link WebsiteRepository.update} */
  async update(website: WebsiteUpdate): Promise<websites> {
    return await websiteRepository.update(website);
  },

  /** {@link WebsiteRepository.delete} */
  async delete({
    id,
    accountId,
  }: {
    id: string;
    accountId: string;
  }): Promise<websites> {
    return await websiteRepository.delete({ id, accountId });
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
