import jsonld, { JsonLdDocument, NodeObject } from "jsonld";

const context = "https://originator-profile.org/context#";

interface ProfilePair {
  op: {
    iss: string[];
    sub: string[];
    profile: string;
  };
  dp: {
    sub: string[];
    profile: string;
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
 * Profile Set と Profile Pair の配列の中から Profile Pair を取り出す
 *
 * @remarks
 * トップレベルのプロパティが `website` または `ad` であるオブジェクトを Profile Pair とみなす。
 * 将来的にはこれらのプロパティは Profile Set でも使われる可能性があるが、
 * その場合は、この関数の条件判定をより厳しくするか、 JSON-LD を廃止するかして対応したい。
 *
 * オブジェクトのネストが多い構造を jsonld.expand() で展開した際に、
 * 余分な Array が挟まって冗長だったため、この関数では Profile Pair を JSON-LD として
 * 扱わないようにした。
 * @param profiles Profile Set と Profile Pair の JSON-LD 表現
 */
function expandProfilePairs(profiles: JsonLdDocument) {
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

  // profiles が配列でなかったときに [] で包んで配列にする
  const profileArray = Array.isArray(profiles) ? profiles : [profiles];

  const websiteProfilePairs = (profileArray as JsonLdDocument[]).filter(
    isWebsiteProfilePair,
  ) as WebsiteProfilePair[];
  const website = websiteProfilePairs.map((doc) => doc.website);

  const adProfilePairs = (profileArray as JsonLdDocument[]).filter(
    isAdProfilePair,
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
    website: ProfilePair[];
    ad: ProfilePair[];
  } = {
    advertisers: [],
    publishers: [],
    main: [],
    profile: [],
    website: profilePairs.website,
    // TODO ad Profile Pair の使い方に合わせて返し方を検討して
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
