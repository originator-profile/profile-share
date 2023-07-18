import { Dp as DpModel, Op as OpModel } from "@originator-profile/model";
import { ProfileGenericError } from "@originator-profile/verify";

export type Op = OpModel & { error?: ProfileGenericError };
export type Dp = DpModel & { error?: ProfileGenericError };
export type Profile = Op | Dp;
