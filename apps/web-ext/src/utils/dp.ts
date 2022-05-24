import { JwtProfilePayload } from "../types/profile";
import {
  JwtDpPayload,
  Dp,
  DpItem,
  DpWebsite,
  DpText,
  DpVisibleText,
  DpHtml,
} from "../types/dp";

export const isJwtDpPayload = (
  payload: JwtProfilePayload
): payload is JwtDpPayload =>
  "https://opr.webdino.org/jwt/claims/dp" in payload;
export const isWebsite = (dpItem: DpItem): dpItem is DpWebsite =>
  dpItem.type === "website";
export const isText = (dpItem: DpItem): dpItem is DpText =>
  dpItem.type === "text";
export const isVisibleText = (dpItem: DpItem): dpItem is DpVisibleText =>
  dpItem.type === "visibleText";
export const isHtml = (dpItem: DpItem): dpItem is DpHtml =>
  dpItem.type === "html";

export const toDp = ({
  iss,
  sub,
  iat,
  exp,
  "https://opr.webdino.org/jwt/claims/dp": { item },
}: JwtDpPayload): Dp => ({
  issuer: iss,
  subject: sub,
  issuedAt: new Date(iat * 1000).toISOString(),
  expiredAt: new Date(exp * 1000).toISOString(),
  item,
});
