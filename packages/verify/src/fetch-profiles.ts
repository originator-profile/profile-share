import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";

/**
 * Profiles Set の取得
 * @param profileEndpoint 取得先エンドポイント
 */
export async function fetchProfiles(
  profileEndpoint: string
): Promise<JsonLdDocument | ProfilesFetchFailed> {
  let profiles;
  try {
    const url = new URL(profileEndpoint);
    const res = await fetch(url.href);
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
