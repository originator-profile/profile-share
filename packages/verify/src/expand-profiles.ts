import jsonld, { JsonLdDocument, NodeObject } from "jsonld";

const context = "https://originator-profile.org/context#";

/** @deprecated use context */
const deprecatedContext = "https://github.com/webdino/profile#";

function Values(node: NodeObject) {
  function values<Key extends "advertiser" | "publisher" | "main" | "profile">(
    key: Key
  ): string[] {
    return (
      (node[`${context}${key}`] ?? node[`${deprecatedContext}${key}`] ?? [])
        // @ts-expect-error assert
        .map((value: { "@value": string }) => value["@value"])
    );
  }

  return values;
}

function nodeToObj(node: NodeObject) {
  const values = Values(node);

  return {
    advertisers: values("advertiser"),
    publishers: values("publisher"),
    main: values("main"),
    profile: values("profile"),
  };
}

/**
 * Profile Set の JSON-LD 表現の Profile Set への展開
 * @param profiles Profile Set の JSON-LD 表現
 */
export async function expandProfiles(profiles: JsonLdDocument) {
  const expanded = await jsonld.expand(profiles);
  const res: {
    advertisers: string[];
    publishers: string[];
    main: string[];
    profile: string[];
  } = { advertisers: [], publishers: [], main: [], profile: [] };
  for (const node of expanded) {
    const obj = nodeToObj(node);
    res.advertisers.push(...obj.advertisers);
    res.publishers.push(...obj.publishers);
    res.main.push(...obj.main);
    res.profile.push(...obj.profile);
  }
  return res;
}
