import { JWTPayload } from "jose";
import { JwtOpPayload, JwtDpPayload } from "@webdino/profile-model";

/**
 * JWTPayload が JwtOpPayload 型であるか否か
 * @param payload
 * @return JwtOpPayload 型であれば true、それ以外ならば false
 */
export function isJwtOpPayload(payload: JWTPayload): payload is JwtOpPayload {
  return "https://opr.webdino.org/jwt/claims/op" in payload;
}

/**
 * JWTPayload が JwtDpPayload 型であるか否か
 * @param payload
 * @return JwtDpPayload 型であれば true、それ以外ならば false
 */
export function isJwtDpPayload(payload: JWTPayload): payload is JwtDpPayload {
  return "https://opr.webdino.org/jwt/claims/dp" in payload;
}
