import { Op, OpItem } from "./op";
import { Dp, DpItem } from "./dp";

export type { JwtProfilePayload } from "@webdino/profile-sign";
export type Profile = Op | Dp;
export type ProfileItem = OpItem | DpItem;
