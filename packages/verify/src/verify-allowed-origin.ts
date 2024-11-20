import { AllowedOrigin } from "@originator-profile/model";

/**
 * URLオリジンが対象のオリジンの中に含まれているのか検証する
 * @param origin 対象とするオリジン
 * @param allowedOrigins 情報の対象となるオリジン
 * @returns 検証結果: allowedOriginsの中にoriginが含まれていればtrue, それ以外ならfalse
 */
export function verifyAllowedOrigin(
  origin: URL["origin"],
  allowedOrigins: AllowedOrigin,
): boolean {
  return [allowedOrigins].flat().includes(origin);
}
