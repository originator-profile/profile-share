import { expand, JsonLdDocument } from "jsonld";

/**
 * Profile Document の Profile Set への変換
 * @param profileDocument Profile Document
 */
export async function expandProfileDocument(profileDocument: JsonLdDocument) {
  const [expanded] = await expand(profileDocument);
  const context = "https://github.com/webdino/profile#";
  if (!expanded)
    return { advertisers: [], publishers: [], main: [], profile: [] };
  const advertisers: string[] =
    // @ts-expect-error assert
    expanded[`${context}advertiser`]?.map(
      (advertiser: { "@value": string }) => advertiser["@value"]
    ) ?? [];
  const publishers: string[] =
    // @ts-expect-error assert
    expanded[`${context}publisher`]?.map(
      (publisher: { "@value": string }) => publisher["@value"]
    ) ?? [];
  const main: string[] =
    // @ts-expect-error assert
    expanded[`${context}main`]?.map(
      (main: { "@value": string }) => main["@value"]
    ) ?? [];
  // @ts-expect-error assert
  const profile: string[] = expanded[`${context}profile`].map(
    (profile: { "@value": string }) => profile["@value"]
  );
  return { advertisers, publishers, main, profile };
}
