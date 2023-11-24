import { JwtDpPayload } from "@originator-profile/model";

/**
 * 対象のオリジンで利用可能な Dp ペイロードの検証
 * @param origin 対象とするオリジン
 * @param payload Dp ペイロード
 * @return 検証結果: allowedOrigins プロパティに`*`かオリジンが含まれていれば true、それ以外ならば false
 */
export function verifyOrigin(
  origin: URL["origin"],
  payload: JwtDpPayload,
): boolean {
  return (
    payload["https://originator-profile.org/dp"].allowedOrigins?.some(
      (allowedOrigin) => ["*", origin].includes(allowedOrigin),
    ) ?? true
  );
}
