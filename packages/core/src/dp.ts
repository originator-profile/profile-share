import { Dp } from "@webdino/profile-model";
import JwtDpPayload from "@webdino/profile-model/src/jwt-dp-payload";

/**
 * JwtDpPayload を与えると有効な Dp を返す関数
 * @param payload
 * @return Dp
 */
export function fromJwtDpPayload(payload: JwtDpPayload): Dp {
  return {
    issuer: payload.iss,
    subject: payload.sub,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiredAt: new Date(payload.exp * 1000).toISOString(),
    ...payload["https://opr.webdino.org/jwt/claims/dp"],
  };
}
