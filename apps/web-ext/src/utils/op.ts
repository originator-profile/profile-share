import { JwtProfilePayload, Profile } from "../types/profile";
import {
  JwtOpPayload,
  Op,
  OpItem,
  OpHolder,
  OpCertifier,
  OpCredential,
} from "../types/op";

const opItemTypes: OpItem["type"][] = ["holder", "certifier", "credential"];

export const isJwtOpPayload = (
  payload: JwtProfilePayload
): payload is JwtOpPayload =>
  "https://opr.webdino.org/jwt/claims/op" in payload;
export const isOp = (profile: Profile): profile is Op =>
  profile.item.some((item) =>
    opItemTypes.includes(item.type as OpItem["type"])
  );
export const isHolder = (opItem: OpItem): opItem is OpHolder =>
  opItem.type === "holder";
export const isCertifier = (opItem: OpItem): opItem is OpCertifier =>
  opItem.type === "certifier";
export const isCredential = (opItem: OpItem): opItem is OpCredential =>
  opItem.type === "credential";

export const toOp = (
  {
    iss,
    sub,
    iat,
    exp,
    "https://opr.webdino.org/jwt/claims/op": { item, jwks },
  }: JwtOpPayload,
  error?: Error
): Op => ({
  issuer: iss,
  subject: sub,
  issuedAt: new Date(iat * 1000).toISOString(),
  expiredAt: new Date(exp * 1000).toISOString(),
  item,
  jwks,
  error,
});
