import { Op, Dp } from "@webdino/profile-model";
import { JWTVerifyResult, ResolvedKey } from "jose";
import { JwtOpPayload, JwtDpPayload } from "./claims";
import {
  ProfileClaimsValidationFailed,
  ProfilesVerifyFailed,
  ProfileTokenVerifyFailed,
} from "./errors";

/** Profile の Token の復号結果 */
export type DecodeResult =
  | { op: true; payload: JwtOpPayload; jwt: string }
  | { dp: true; payload: JwtDpPayload; jwt: string }
  | ProfileClaimsValidationFailed;

/** Profile の Token の検証結果 */
export type VerifyTokenResult =
  | (JWTVerifyResult & ResolvedKey & ({ op: Op } | { dp: Dp }))
  | ProfileClaimsValidationFailed
  | ProfileTokenVerifyFailed;

/** Profiles Set */
export type Profiles = { profile: string[] };

/** Profile の検証結果 */
export type VerifyResult = ProfilesVerifyFailed | VerifyTokenResult;

/** Profiles Set の検証結果 */
export type VerifyResults = VerifyResult[];
