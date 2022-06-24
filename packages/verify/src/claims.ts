import { Op, Dp, JwtProfilePayload } from "@webdino/profile-model";
import JwtOpPayload from "@webdino/profile-model/src/jwt-op-payload";
import JwtDpPayload from "@webdino/profile-model/src/jwt-dp-payload";
import { isJwtOpPayload, isJwtDpPayload } from "@webdino/profile-sign";

export {
  JwtProfilePayload,
  JwtOpPayload,
  JwtDpPayload,
  isJwtOpPayload,
  isJwtDpPayload,
};

// TODO: システム全体で使われうるので packages/core あたりに外部化させたい
export function toOp(claims: JwtOpPayload): Op {
  return {
    issuer: claims.iss,
    subject: claims.sub,
    issuedAt: new Date(claims.iat * 1000).toISOString(),
    expiredAt: new Date(claims.exp * 1000).toISOString(),
    ...claims["https://opr.webdino.org/jwt/claims/op"],
  };
}

// TODO: システム全体で使われうるので packages/core あたりに外部化させたい
export function toDp(claims: JwtDpPayload): Dp {
  return {
    issuer: claims.iss,
    subject: claims.sub,
    issuedAt: new Date(claims.iat * 1000).toISOString(),
    expiredAt: new Date(claims.exp * 1000).toISOString(),
    ...claims["https://opr.webdino.org/jwt/claims/dp"],
  };
}
