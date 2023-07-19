import { JsonLdDocument, NodeObject } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getEndpoints(doc: Document): string[] {
  const endpoints = [
    ...doc.querySelectorAll(
      `link[rel="alternate"][type="application/ld+json"]`,
    ),
  ].map((e) => new URL(e.getAttribute("href") ?? "", doc.location.href).href);

  if (endpoints.length === 0) {
    throw new ProfilesFetchFailed("Invalid endpoints");
  }

  return endpoints;
}

function getEmbeddedProfileSets(doc: Document): NodeObject[] {
  const elements = [
    ...doc.querySelectorAll(`script[type="application/ld+json"]`)
  ]
  const profileSetArray = elements.map((elem) => {
    const text = elem.textContent;
    if (typeof text !== 'string') {
      return;
    }
    let jsonld;
    try {
      jsonld = JSON.parse(text);
    } catch (e: unknown) {
      return undefined;
    }
    if (jsonld["@context"] && jsonld.main && jsonld.profile) {
      return jsonld as NodeObject;
    }
    return;
  }).filter((e) => typeof e !== 'undefined') as NodeObject[];

  return profileSetArray;

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
    const profileSetFromEndPoints = await Promise.all(
      profileEndpoints.map(async (endpoint) => {
        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new ProfilesFetchFailed(`HTTP ステータスコード ${res.status}`);
        }

        return await res.json();
      }),
    );
    profiles = profiles.concat(profileSetFromEndPoints)
  } catch (e) {
    if (profiles.length > 0) {
      return profiles;
    }
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
  return profiles;
}
