import { JwtOpPayload, OpItem } from "../types/op";
import { Op } from "@webdino/profile-model";

export const isHolder = (
  opItem: OpItem
): opItem is Extract<OpItem, { type: "holder" }> => opItem.type === "holder";

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
