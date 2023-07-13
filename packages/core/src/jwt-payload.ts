import { JWTPayload } from "jose";
import { JwtOpPayload, JwtDpPayload } from "@originator-profile/model";

export const opNamespace = "https://originator-profile.org/op";
export const dpNamespace = "https://originator-profile.org/dp";

/** @deprecated Use opNamespace */
export const deprecatedOpNamespace = "https://opr.webdino.org/jwt/claims/op";

/** @deprecated Use dpNamespace */
export const deprecatedDpNamespace = "https://opr.webdino.org/jwt/claims/dp";

/**
 * JWTPayload が JwtOpPayload 型であるか否か
 * @param payload
 * @return JwtOpPayload 型であれば true、それ以外ならば false
 */
export function isJwtOpPayload(payload: JWTPayload): payload is JwtOpPayload {
  return opNamespace in payload || deprecatedOpNamespace in payload;
}

/**
 * JWTPayload が JwtDpPayload 型であるか否か
 * @param payload
 * @return JwtDpPayload 型であれば true、それ以外ならば false
 */
export function isJwtDpPayload(payload: JWTPayload): payload is JwtDpPayload {
  return dpNamespace in payload || deprecatedDpNamespace in payload;
}
