import { Dp, JwtDpPayload } from "@webdino/profile-model";
import { deprecatedDpNamespace, dpNamespace } from "./jwt-payload";

/**
 * JwtDpPayload を与えると有効な Dp を返す関数
 * @param payload
 * @return Dp
 */
export function fromJwtDpPayload(payload: JwtDpPayload): Dp {
  const claims = payload[dpNamespace] ?? payload[deprecatedDpNamespace];

  return {
    type: "dp",
    issuer: payload.iss,
    subject: payload.sub,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiredAt: new Date(payload.exp * 1000).toISOString(),
    ...claims,
  } as Dp;
}
