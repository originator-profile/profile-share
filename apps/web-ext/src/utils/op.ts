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
  issuedAt: iat.toString(),
  expiredAt: exp.toString(),
  item,
  jwks,
});
