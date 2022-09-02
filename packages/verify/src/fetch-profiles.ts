/**
 * Profiles Set の取得
 * @param targetOrigin 取得先オリジン
 * @param profilesLink 取得先エンドポイント
 */
export async function fetchProfiles(
  targetOrigin: string,
  profilesLink: string | null
) {
  let profileEndpoint, profiles;
  try {
    profileEndpoint = new URL(
      profilesLink ?? `${targetOrigin}/.well-known/op-document`
    );
    profiles = await fetch(profileEndpoint.href).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ステータスコード ${res.status}`);
      }
      return res.json();
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`プロファイルを取得できませんでした:\n${e.message}`, {
        cause: e,
      });
    } else {
      throw e;
    }
  }
  return { profiles, profileEndpoint };
}
