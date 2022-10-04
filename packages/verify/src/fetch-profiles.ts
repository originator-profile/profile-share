import { JsonLdDocument } from "jsonld";

/**
 * Profiles Set の取得
 * @param profileEndpoint 取得先エンドポイント
 */
export async function fetchProfiles(
  profileEndpoint: string
): Promise<JsonLdDocument> {
  const url = new URL(profileEndpoint);
  let profiles;
  try {
    const res = await fetch(url.href);
    if (!res.ok) {
      throw new Error(`HTTP ステータスコード ${res.status}`);
    }
    profiles = await res.json();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`プロファイルを取得できませんでした:\n${e.message}`, {
        cause: e,
      });
    } else {
      throw e;
    }
  }
  return profiles;
}
