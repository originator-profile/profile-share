export type DigestSriContent = {
  id: string;
  digestSRI: string;
};

export type ContentFetcher = (
  elements: ReadonlyArray<HTMLElement>,
) => Promise<ReadonlyArray<Response>>;

export type ElementSelector = (params: {
  cssSelector?: string;
  integrity: string;
  document: Document;
}) => ReadonlyArray<HTMLElement>;
