import { Op, JwtOpPayload, OriginatorProfile } from "@originator-profile/model";
import { opNamespace } from "./jwt-payload";

/**
 * JwtOpPayload を与えると有効な Op を返す関数
 * @param payload
 * @return Op
 */
export function fromJwtOpPayload(payload: JwtOpPayload): Op {
  const claims = payload[opNamespace];

  return {
    type: "op",
    issuer: payload.iss,
    subject: payload.sub,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiredAt: new Date(payload.exp * 1000).toISOString(),
    ...claims,
  } as Op;
}

/**
 * JwtOpPayload を与えると有効な Op を返す関数
 * @param payload
 * @return Op
 */
export function fromSdJwtOpPayload(
  payload: OriginatorProfile,
): OriginatorProfile {
  return payload;
}
