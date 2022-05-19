import {
  JwtOpPayload,
  Op,
  OpItem,
  OpHolder,
  OpCertifier,
  OpCredential,
} from "../types/op";

export const isHolder = (opItem: OpItem): opItem is OpHolder =>
  opItem.type === "holder";
export const isCertifier = (opItem: OpItem): opItem is OpCertifier =>
  opItem.type === "certifier";
export const isCredential = (opItem: OpItem): opItem is OpCredential =>
  opItem.type === "credential";

export const toOp = ({
  iss,
  sub,
  iat,
  exp,
  "https://opr.webdino.org/jwt/claims/op": { item, jwks },
}: JwtOpPayload): Op => ({
  issuer: iss,
  subject: sub,
  issuedAt: new Date(iat * 1000).toISOString(),
  expiredAt: new Date(exp * 1000).toISOString(),
  item,
  jwks,
});
