import { expand, JsonLdDocument } from "jsonld";

/**
 * Profiles Set の JSON-LD 表現の Profile Set への展開
 * @param profiles Profiles Set の JSON-LD 表現
 */
export async function expandProfiles(profiles: JsonLdDocument) {
  const [expanded] = await expand(profiles);
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
