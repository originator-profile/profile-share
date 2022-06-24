import { JWTPayload } from "jose";
import JwtOpPayload from "@webdino/profile-model/src/jwt-op-payload";
import JwtDpPayload from "@webdino/profile-model/src/jwt-dp-payload";

/**
 * JwtOpPayload 型であるか否か
 * @param payload
 * @return JwtOpPayload 型であれば true、それ以外ならば false
 */
export function isJwtOpPayload(payload: JWTPayload): payload is JwtOpPayload {
  return "https://opr.webdino.org/jwt/claims/op" in payload;
}

/**
 * JwtDpPayload 型であるか否か
 * @param payload
 * @return JwtDpPayload 型であれば true、それ以外ならば false
 */
export function isJwtDpPayload(payload: JWTPayload): payload is JwtDpPayload {
  return "https://opr.webdino.org/jwt/claims/dp" in payload;
}
