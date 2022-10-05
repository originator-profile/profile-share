import {
  Dp as DpModel,
  Op as OpModel,
  DpText,
  DpVisibleText,
  DpHtml,
} from "@webdino/profile-model";

export type Op = OpModel & { error?: Error };
export type Dp = DpModel & { error?: Error };
export type Profile = Op | Dp;
export type DpLocator = DpText | DpVisibleText | DpHtml;
