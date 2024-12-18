import type { Image, RawTarget } from "@originator-profile/model";

export type DigestSriContent = Image;

export type ContentFetcher = (
  elements: ReadonlyArray<HTMLElement>,
) => Promise<ReadonlyArray<Response>>;

export type ElementSelector = (params: {
  cssSelector?: string;
  integrity?: string;
  document: Document;
}) => ReadonlyArray<HTMLElement>;

/** 文脈に応じて Document を提供する関数 */
export type DocumentProvider = (raw: RawTarget) => Promise<Document>;
