import { Dp as DpModel, Op as OpModel } from "@webdino/profile-model";
import { ProfileGenericError } from "@webdino/profile-verify";

export type Op = OpModel & { error?: ProfileGenericError };
export type Dp = DpModel & { error?: ProfileGenericError };
export type Profile = Op | Dp;
