import {
  Dp as DpModel,
  DpItem,
  OgWebsite as DpWebsite,
} from "@webdino/profile-model";

export type Dp = DpModel & { error?: Error };
export type { DpItem, DpWebsite };
