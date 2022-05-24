import { Op, JwtOpPayload, OpItem } from "./op";
import { Dp, JwtDpPayload, DpItem } from "./dp";

export type Profile = Op | Dp;
export type JwtProfilePayload = JwtOpPayload | JwtDpPayload;
export type ProfileItem = OpItem | DpItem;
