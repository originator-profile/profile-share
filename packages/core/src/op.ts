import { Op, JwtOpPayload } from "@webdino/profile-model";

/**
 * JwtOpPayload を与えると有効な Op を返す関数
 * @param payload
 * @return Op
 */
export function fromJwtOpPayload(payload: JwtOpPayload): Op {
  return {
    type: "op",
    issuer: payload.iss,
    subject: payload.sub,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiredAt: new Date(payload.exp * 1000).toISOString(),
    ...payload["https://originator-profile.org/op"],
  };
}
