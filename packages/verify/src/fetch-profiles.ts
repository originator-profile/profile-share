/**
 * Profiles Set の取得
 * @param targetOrigin 取得先オリジン
 * @param profilesLink 取得先エンドポイント
 */
export async function fetchProfiles(
  targetOrigin?: string,
  profilesLink?: string
) {
  if (!profilesLink && !targetOrigin)
    throw new Error(
      "プロファイルを取得できませんでした:\nプロファイルを取得するウェブページが特定できませんでした"
    );
  const profileEndpoint = new URL(
    profilesLink ?? `${targetOrigin}/.well-known/op-document`
  );
  const profiles = await fetch(profileEndpoint.href)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ステータスコード ${res.status}`);
      }
      return res.json();
    })
    .catch((e) => e);
  if (profiles instanceof Error) {
    throw {
      ...profiles,
      message: `プロファイルを取得できませんでした:\n${profiles.message}`,
    };
  }
  return { profiles, profileEndpoint };
}
