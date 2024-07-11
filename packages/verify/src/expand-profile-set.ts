import jsonld, { JsonLdDocument, NodeObject } from "jsonld";
import { ProfilePair } from "./types";

const context = "https://originator-profile.org/context#";

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
 * @param profiles Profile Set と Profile Pair の JSON-LD 表現
 */
export async function expandProfilePairs(profiles: JsonLdDocument) {
  const getValue = (
    node: NodeObject | undefined,
    key: string,
  ): NodeObject | undefined => {
    if (typeof node !== "undefined") {
      const value = node[`${context}${key}`] as NodeObject;

      if (typeof value !== "undefined") {
        return value[0] as NodeObject;
      }
    }
  };
  const extractValues = (node?: NodeObject): ProfilePair | undefined => {
    if (typeof node === "undefined") {
      return undefined;
    }

    const dp = getValue(node, "dp");
    const dpProfile = getValue(dp, "profile")?.["@value"];
    const dpSub = getValue(dp, "sub")?.["@value"];

    const op = getValue(node, "op");
    const opProfile = getValue(op, "profile")?.["@value"];
    const opSub = getValue(op, "sub")?.["@value"];
    const opIss = getValue(op, "iss")?.["@value"];

    if (!dpProfile || !dpSub || !opProfile || !opSub || !opIss) {
      return undefined;
    }

    return {
      op: {
        profile: opProfile as string,
        sub: opSub as string,
        iss: opIss as string,
      },
      dp: {
        profile: dpProfile as string,
        sub: dpSub as string,
      },
    };
  };

  const expanded = await jsonld.expand(profiles);

  const websiteProfilePairs = expanded.filter(
    (node) => `${context}website` in node,
  );
  const adProfilePairs = expanded.filter((node) => `${context}ad` in node);

  const website = websiteProfilePairs
    .map((node) => getValue(node, "website"))
    .map(extractValues)
    .filter((node) => typeof node !== "undefined") as ProfilePair[];

  const ad = adProfilePairs
    .map((node) => getValue(node, "ad"))
    .map(extractValues)
    .filter((node) => typeof node !== "undefined") as ProfilePair[];

  return {
    website,
    ad,
  };
}

/**
 * Profile Set の JSON-LD 表現の Profile Set への展開
 * @param profiles Profile Set の JSON-LD 表現
 * @deprecated この関数は非推奨です。代わりに fetchWebAssertionSet を使用してください。
 */
export async function expandProfileSet(profiles: JsonLdDocument) {
  console.warn("fetchProfileSet は非推奨です。代わりに fetchWebAssertionSet を使用してください。");
  const expanded = await jsonld.expand(profiles);
  const res: {
    advertisers: string[];
    publishers: string[];
    main: string[];
    profile: string[];
  } = {
    advertisers: [],
    publishers: [],
    main: [],
    profile: [],
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
