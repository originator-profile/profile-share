import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getEndpoints(doc: Document): string[] {
  const endpoints = [
    ...doc.querySelectorAll(
      `link[rel="alternate"][type="application/ld+json"]`
    ),
  ].map((e) => new URL(e.getAttribute("href") ?? "", doc.location.href).href);

  if (endpoints.length === 0) {
    throw new ProfilesFetchFailed("Invalid endpoints");
  }

  return endpoints;
}

/**
 * Profile Set の取得
 * @param doc Document オブジェクト
 */
export async function fetchProfiles(
  doc: Document
): Promise<JsonLdDocument | ProfilesFetchFailed> {
  let profiles;
  try {
    const profileEndpoints = getEndpoints(doc);
    profiles = await Promise.all(
      profileEndpoints.map(async (endpoint) => {
        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new ProfilesFetchFailed(`HTTP ステータスコード ${res.status}`);
        }

        return await res.json();
      })
    );
  } catch (e) {
    if (e instanceof Error) {
      return new ProfilesFetchFailed(
        `プロファイルを取得できませんでした:\n${e.message}`,
        {
          cause: e,
        }
      );
    } else {
      throw new Error("Unknown error", { cause: e });
    }
  }
  return profiles;
}
