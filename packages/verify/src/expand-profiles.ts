import jsonld, { JsonLdDocument, NodeObject } from "jsonld";

function nodeToObj(node: NodeObject) {
  const context = "https://originator-profile.org/context#";
  const advertisers: string[] =
    // @ts-expect-error assert
    node[`${context}advertiser`]?.map(
      (advertiser: { "@value": string }) => advertiser["@value"]
    ) ?? [];
  const publishers: string[] =
    // @ts-expect-error assert
    node[`${context}publisher`]?.map(
      (publisher: { "@value": string }) => publisher["@value"]
    ) ?? [];
  const main: string[] =
    // @ts-expect-error assert
    node[`${context}main`]?.map(
      (main: { "@value": string }) => main["@value"]
    ) ?? [];
  // @ts-expect-error assert
  const profile: string[] = node[`${context}profile`].map(
    (profile: { "@value": string }) => profile["@value"]
  );
  return { advertisers, publishers, main, profile };
}

/**
 * Profiles Set の JSON-LD 表現の Profile Set への展開
 * @param profiles Profiles Set の JSON-LD 表現
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
