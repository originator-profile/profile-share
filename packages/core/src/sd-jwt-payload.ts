import { JWTPayload } from "jose";
import { OriginatorProfile } from "@originator-profile/model";

/**
 * JWTPayload が OriginatorProfile 型であるか否か
 * @param payload
 * @return OriginatorProfile 型であれば true、それ以外ならば false
 */
export function isSdJwtOpPayload(
  payload: JWTPayload,
): payload is OriginatorProfile {
  return payload.vct === "https://originator-profile.org/orgnization";
}
