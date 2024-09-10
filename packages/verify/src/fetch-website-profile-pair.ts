import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getProfilePairUrl(origin: string) {
  return `${origin}/.well-known/pp.json`;
}

/**
 * Website Profile Pair の取得
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
      throw new ProfilesFetchFailed("Error_ProfileHTTPError", {
        /* Response objectは拡張機能で受け取れていないので message を持ったError風objectを返す */
        cause: {
          message: String(response.status),
        },
      });
    }
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new ProfilesFetchFailed("Error_WebsiteProfilePairNotFetched", {
        cause: e,
      });
    } else {
      throw new Error("Unknown error", { cause: e });
    }
  }
}
