import { Op, Dp, JwtOpPayload, JwtDpPayload } from "@webdino/profile-model";
import { JWTVerifyResult, ResolvedKey } from "jose";
import {
  ProfileClaimsValidationFailed,
  ProfileTokenVerifyFailed,
  ProfilesResolveFailed,
  ProfilesVerifyFailed,
} from "./errors";

/** Profile の Token の復号結果 */
export type DecodeResult =
  | { op: true; payload: JwtOpPayload; jwt: string }
  | { dp: true; payload: JwtDpPayload; jwt: string }
  | ProfileClaimsValidationFailed;

/** Profile の Token の検証結果 */
export type VerifyTokenResult =
  | (JWTVerifyResult &
      ResolvedKey &
      ({ op: Op; jwt: string } | { dp: Dp; jwt: string }))
  | ProfileClaimsValidationFailed
  | ProfileTokenVerifyFailed;

/** Profiles Set */
export type Profiles = { profile: string[] };

/** Profile の検証結果 */
export type VerifyResult =
  | VerifyTokenResult
  | ProfilesResolveFailed
  | ProfilesVerifyFailed;

/** Profiles Set の検証結果 */
export type VerifyResults = VerifyResult[];
