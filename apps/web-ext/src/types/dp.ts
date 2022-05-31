import { Dp as DpModel } from "@webdino/profile-model";

export type Dp = DpModel & { error?: Error };
export type DpItem = Dp["item"][number];
export type DpWebsite = Extract<DpItem, { type: "website" }>;
export type DpText = Extract<DpItem, { type: "text" }>;
export type DpVisibleText = Extract<DpItem, { type: "visibleText" }>;
export type DpHtml = Extract<DpItem, { type: "html" }>;
