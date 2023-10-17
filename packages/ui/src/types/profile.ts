import { Dp as DpModel, Op as OpModel } from "@originator-profile/model";
import * as errors from "@originator-profile/verify/src/errors";

export type ProfileError = InstanceType<
  (typeof errors)[Extract<
    keyof typeof errors,
    | "ProfileClaimsValidationFailed"
    | "ProfileTokenVerifyFailed"
    | "ProfilesResolveFailed"
    | "ProfilesVerifyFailed"
  >]
>;
export type Op = OpModel & { error?: ProfileError };
export type Dp = DpModel & { error?: ProfileError };
export type Profile = Op | Dp;
