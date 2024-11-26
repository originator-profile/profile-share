import { decodeProtectedHeader, flattenedVerify } from "jose";
import { JOSEError } from "jose/errors";
import { Keys } from "@originator-profile/cryptography";
import { ProfileBodyVerifyFailed } from "./errors";

/**
 * 対象のテキストの検証
 * @deprecated
 * @param body 対象のテキスト
 * @param jws Detached Compact JWS
 * @param keys 公開鍵
 * @return テキストの検証結果
 */
export async function verifyBody(body: string, jws: string, keys: Keys) {
  const { 0: protectedHeader, 2: signature } = jws.split(".") as [
    string,
    string,
    string,
  ];
  const payload = new TextEncoder().encode(body);
  const flattenedJws = {
    protected: protectedHeader,
    payload,
    signature,
  };
  const key = await keys(decodeProtectedHeader(jws), flattenedJws);
  const result = await flattenedVerify(flattenedJws, key).catch(
    (e: JOSEError) => e,
  );
  if (result instanceof Error) {
    return new ProfileBodyVerifyFailed(result.message, { error: result, body });
  }
  return result;
}
