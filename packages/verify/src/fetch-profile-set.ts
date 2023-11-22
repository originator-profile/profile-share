import { JsonLdDocument, NodeObject } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getEndpoints(doc: Document): string[] {
  const endpoints = [
    ...doc.querySelectorAll(
      `link[rel="alternate"][type="application/ld+json"]`,
    ),
  ].map((e) => new URL(e.getAttribute("href") ?? "", doc.location.href).href);

  return endpoints;
}

function getEmbeddedProfileSets(doc: Document): NodeObject[] {
  const elements = [
    ...doc.querySelectorAll(`script[type="application/ld+json"]`),
  ];
  const profileSetArray = elements
    .map((elem) => {
      const text = elem.textContent;
      if (typeof text !== "string") {
        return undefined;
      }
      try {
        const jsonld = JSON.parse(text);
        return jsonld as NodeObject;
      } catch (e: unknown) {
        return undefined;
      }
    })
    .filter((e) => typeof e !== "undefined") as NodeObject[];

  return profileSetArray;
}

function getProfilePairUrl(origin: string) {
  return `${origin}/.well-known/pp.json`;
}

/**
 * Profile Set の取得
 * @param doc Document オブジェクト
 */
export async function fetchProfileSet(
  doc: Document,
): Promise<JsonLdDocument | ProfilesFetchFailed> {
  let profiles = getEmbeddedProfileSets(doc);
  try {
    const profileEndpoints = getEndpoints(doc);
    const profilePairUrl = getProfilePairUrl(doc.location.origin);
    try {
      const response = await fetch(profilePairUrl);
      if (response.ok) {
        const json = await response.json();
        // Profile Pair は最も優先度が高いため、先頭に追加する。
        profiles.unshift(json);
      }
      // Profile Pair が見つからない場合はエラーにはしない。
      // Profile Pair の設置は必須ではないため。
    } catch (e) {
      if (e instanceof Error) {
        console.info(`Profile Pair の取得に失敗しました: ${e.message}`);
      } else {
        throw new Error("Unknown error", { cause: e });
      }
    }

    const profileSetFromEndpoints = await Promise.all(
      profileEndpoints.map(async (endpoint) => {
        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new ProfilesFetchFailed(`HTTP ステータスコード ${res.status}`);
        }

        return await res.json();
      }),
    );
    profiles = profiles.concat(profileSetFromEndpoints);
  } catch (e) {
    if (e instanceof Error) {
      return new ProfilesFetchFailed(
        `プロファイルを取得できませんでした:\n${e.message}`,
        {
          cause: e,
        },
      );
    } else {
      throw new Error("Unknown error", { cause: e });
    }
  }

  if (profiles.length === 0) {
    return new ProfilesFetchFailed("No profile sets found");
  }

  return profiles;
}
