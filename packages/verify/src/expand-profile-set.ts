import jsonld, { JsonLdDocument, NodeObject } from "jsonld";

const context = "https://originator-profile.org/context#";

interface ProfilePair {
  op: {
    iss: string[];
    sub: string[];
    profiles: string[];
  };
  dp: {
    sub: string[];
    profiles: string[];
  };
}

interface WebsiteProfilePair {
  "@context": string;
  website: ProfilePair;
}

interface AdProfilePair {
  "@context": string;
  ad: ProfilePair;
}

function getNodeOf(key: string, node: NodeObject) {
  return node[`${context}${key}`];
}

const getValueOf = (value: { "@value": string }) => value["@value"];

function Values(node: NodeObject) {
  function values<Key extends "advertiser" | "publisher" | "main" | "profile">(
    key: Key
  ): string[] {
    return (
      (node[`${context}${key}`] ?? [])
        // @ts-expect-error assert
        .map((value: { "@value": string }) => value["@value"])
    );
  }

  return values;
}

function nodeToObj(node: NodeObject) {
  const values = Values(node);

  // const webSiteNode = getNodeOf("website", node);
  // const adNode = getNodeOf("ad", node);

  return {
    advertisers: values("advertiser"),
    publishers: values("publisher"),
    main: values("main"),
    profile: values("profile"),
  };
}

/**
 * Profile Set と Profile Pair の配列の中から Profile Pair を取り出す
 * @param profiles Profile Set の JSON-LD 表現
 */
export function expandProfilePairs(profiles: JsonLdDocument) {
  const isWebsiteProfilePair = (doc: unknown) => {
    return (
      typeof doc === "object" &&
      doc &&
      "website" in doc &&
      typeof doc.website === "object" &&
      doc.website &&
      "op" in doc.website &&
      "dp" in doc.website
    );
  };

  const isAdProfilePair = (doc: unknown) => {
    return (
      typeof doc === "object" &&
      doc &&
      "ad" in doc &&
      typeof doc.ad === "object" &&
      doc.ad &&
      "op" in doc.ad &&
      "dp" in doc.ad
    );
  };

  const websiteProfilePairs = (profiles as JsonLdDocument[]).filter(
    isWebsiteProfilePair
  ) as WebsiteProfilePair[];
  const website = websiteProfilePairs.map((doc) => doc.website);

  const adProfilePairs = (profiles as JsonLdDocument[]).filter(
    isAdProfilePair
  ) as AdProfilePair[];
  const ad = adProfilePairs.map((doc) => doc.ad);

  return {
    website,
    ad,
  };
}

/**
 * Profile Set の JSON-LD 表現の Profile Set への展開
 * @param profiles Profile Set の JSON-LD 表現
 */
export async function expandProfileSet(profiles: JsonLdDocument) {
  const profilePairs = expandProfilePairs(profiles);
  const expanded = await jsonld.expand(profiles);
  const res: {
    advertisers: string[];
    publishers: string[];
    main: string[];
    profile: string[];
    website: any[];
    ad: any[];
  } = {
    advertisers: [],
    publishers: [],
    main: [],
    profile: [],
    website: profilePairs.website,
    ad: profilePairs.ad,
  };
  for (const node of expanded) {
    const obj = nodeToObj(node);
    res.advertisers.push(...obj.advertisers);
    res.publishers.push(...obj.publishers);
    res.main.push(...obj.main);
    res.profile.push(...obj.profile);
  }
  return res;
}
