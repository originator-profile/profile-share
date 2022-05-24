import { Op, JwtOpPayload } from "./op";
import { Dp, JwtDpPayload } from "./dp";

export type Profile = Op | Dp;
export type JwtProfilePayload = JwtOpPayload | JwtDpPayload;
