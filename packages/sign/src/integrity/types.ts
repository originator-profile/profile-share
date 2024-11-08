import type { Image } from "@originator-profile/model";

export type DigestSriContent = Image;

export type ContentFetcher = (
  elements: ReadonlyArray<HTMLElement>,
) => Promise<ReadonlyArray<Response>>;

export type ElementSelector = (params: {
  cssSelector?: string;
  integrity?: string;
  document: Document;
}) => ReadonlyArray<HTMLElement>;
