import jsonld, { JsonLdDocument, NodeObject } from "jsonld";

const context = "https://originator-profile.org/context#";

interface Leaf {
  "@value": string;
  "@type": string;
}

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

function getNodeOf(key: string, node: NodeObject) {
  return node[`${context}${key}`];
}

const getValueOf = (value: { "@value": string }) => value["@value"];

function Values(node: NodeObject) {
  function values<Key extends "advertiser" | "publisher" | "main" | "profile">(
    key: Key,
  ): string[] {
    return (
      (node[`${context}${key}`] ?? [])
        // @ts-expect-error assert
        .map((value: { "@value": string }) => value["@value"])
    );
  }

  return values;
}

function getProfilePair(node: NodeObject): ProfilePair {
  const op = getNodeOf("op", node) as NodeObject;
  const dp = getNodeOf("dp", node) as NodeObject;
  const opProfiles = (getNodeOf("profile", op) as Leaf[])?.map(getValueOf);
  const dpProfiles = (getNodeOf("profile", dp) as Leaf[])?.map(getValueOf);
  const iss = (getNodeOf("iss", op) as Leaf[])?.map(getValueOf);
  const sub = (getNodeOf("sub", op) as Leaf[])?.map(getValueOf);
  const dpSub = (getNodeOf("sub", dp) as Leaf[])?.map(getValueOf);
  return {
    op: {
      iss,
      sub,
      profiles: opProfiles,
    },
    dp: {
      sub: dpSub,
      profiles: dpProfiles,
    },
  };
}

function nodeToObj(node: NodeObject) {
  const values = Values(node);

  const webSiteNode = getNodeOf("website", node);
  const adNode = getNodeOf("ad", node);

  return {
    advertisers: values("advertiser"),
    publishers: values("publisher"),
    main: values("main"),
    profile: values("profile"),
    website: webSiteNode && getProfilePair(webSiteNode as NodeObject),
    ad: adNode && getProfilePair(adNode as NodeObject),
  };
}

/**
 * Profile Set の JSON-LD 表現の Profile Set への展開
 * @param profiles Profile Set の JSON-LD 表現
 */
export async function expandProfileSet(profiles: JsonLdDocument) {
  const expanded = await jsonld.expand(profiles);
  const res: {
    advertisers: string[];
    publishers: string[];
    main: string[];
    profile: string[];
  } = { advertisers: [], publishers: [], main: [], profile: [] };
  for (const node of expanded) {
    const obj = nodeToObj(node);
    if (obj.website) {
      res.profile.push(...obj.website.op.profiles);
      res.profile.push(...obj.website.dp.profiles);
    }
    if (obj.ad) {
      res.profile.push(...obj.ad.op.profiles);
      res.profile.push(...obj.ad.dp.profiles);
    }
    res.advertisers.push(...obj.advertisers);
    res.publishers.push(...obj.publishers);
    res.main.push(...obj.main);
    res.profile.push(...obj.profile);
  }
  return res;
}
