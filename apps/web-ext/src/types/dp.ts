import { Dp as DpModel } from "@webdino/profile-model";
import { DpPayload } from "@webdino/profile-sign/src/types";
import { JWTPayload } from "jose";

export type Dp = DpModel & { error?: Error };
export type JwtDpPayload = DpPayload &
  Required<Pick<JWTPayload, "iss" | "sub" | "iat" | "exp">>;
export type DpItem = Dp["item"][number];
export type DpWebsite = Extract<DpItem, { type: "website" }>;
export type DpText = Extract<DpItem, { type: "text" }>;
export type DpVisibleText = Extract<DpItem, { type: "visibleText" }>;
export type DpHtml = Extract<DpItem, { type: "html" }>;
