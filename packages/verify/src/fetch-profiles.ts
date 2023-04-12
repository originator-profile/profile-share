import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getEndpoint(doc: Document): string {
  const link = doc
    .querySelector('link[rel="alternate"][type="application/ld+json"]')
    ?.getAttribute("href");
  const profileEndpoint = link ?? `${doc.location.origin}/.well-known/ps.json`;
  return new URL(profileEndpoint).href;
}

/**
 * Profiles Set の取得
 * @param doc Document オブジェクト
 */
export async function fetchProfiles(
  doc: Document
): Promise<JsonLdDocument | ProfilesFetchFailed> {
  let profiles;
  try {
    const profileEndpoint = getEndpoint(doc);
    const res = await fetch(profileEndpoint);
    if (!res.ok) {
      throw new ProfilesFetchFailed(`HTTP ステータスコード ${res.status}`);
    }
    profiles = await res.json();
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
