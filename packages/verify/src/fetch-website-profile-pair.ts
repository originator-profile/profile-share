import { JsonLdDocument, NodeObject } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

function getProfilePairUrl(origin: string) {
  return `${origin}/.well-known/pp.json`;
}

/**
 * Website Profile Pair の取得
 * @param doc Document オブジェクト
 */
export async function fetchWebsiteProfilePair(
  doc: Document
): Promise<JsonLdDocument | ProfilesFetchFailed> {
  const profilePairUrl = getProfilePairUrl(doc.location.origin);
  try {
    const response = await fetch(profilePairUrl);
    if (response.ok) {
      const json = await response.json();
      // Profile Pair は最も優先度が高いため、先頭に追加する。
      return json;
    } else {
      return new ProfilesFetchFailed(
        `HTTP ステータスコード ${response.status}`
      );
    }
    // Profile Pair が見つからない場合はエラーにはしない。
    // Profile Pair の設置は必須ではないため。
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
}
