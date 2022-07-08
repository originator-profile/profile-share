/**
 * Profile Document の取得
 * @param targetOrigin 取得先オリジン
 * @param profilesLink 取得先エンドポイント
 */
export async function fetchProfileDocument(
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
  const profileDocument = await fetch(profileEndpoint.href)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ステータスコード ${res.status}`);
      }
      return res.json();
    })
    .catch((e) => e);
  if (profileDocument instanceof Error) {
    throw {
      ...profileDocument,
      message: `プロファイルを取得できませんでした:\n${profileDocument.message}`,
    };
  }
  return { profileDocument, profileEndpoint };
}
