import { Profile } from "../types/profile";
import { VerifyResult, ProfileGenericError } from "@originator-profile/verify";
import { JwtDpPayload } from "@originator-profile/model";
import {
  fromJwtDpPayload,
  fromJwtOpPayload,
  isJwtOpPayload,
} from "@originator-profile/core";

/**
 * 検証結果から Profile 型へ変換する関数
 * @param verifyResult 検証結果
 * @returns Profile
 */
export default function toProfile(verifyResult: VerifyResult): Profile {
  if (verifyResult instanceof ProfileGenericError) {
    const payload = verifyResult.result.payload ?? {};
    const profile = isJwtOpPayload(payload)
      ? fromJwtOpPayload(payload)
      : fromJwtDpPayload(payload as JwtDpPayload);
    return { ...profile, error: verifyResult };
  }

  return "op" in verifyResult ? verifyResult.op : verifyResult.dp;
}
