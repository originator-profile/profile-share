import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getProfilePairUrl(origin: string) {
  return `${origin}/.well-known/pp.json`;
}

/**
 * Website Profile Pair の取得
 * @deprecated
 * @param doc Document オブジェクト
 */
export async function fetchWebsiteProfilePair(
  doc: Document,
): Promise<JsonLdDocument | ProfilesFetchFailed> {
  const profilePairUrl = getProfilePairUrl(doc.location.origin);
  try {
    const response = await fetch(profilePairUrl);
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      return new ProfilesFetchFailed(
        `HTTP ステータスコード ${response.status}`,
      );
    }
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new ProfilesFetchFailed(
        `website Profile Pairを取得できませんでした:\n${e.message}`,
        {
          cause: e,
        },
      );
    } else {
      throw new Error("Unknown error", { cause: e });
    }
  }
}
