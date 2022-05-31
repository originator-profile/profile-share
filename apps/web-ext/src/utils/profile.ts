import { Profile } from "../types/profile";
import {
  VerifyResult,
  ProfileGenericError,
  isJwtOpPayload,
  JwtDpPayload,
  toOp,
  toDp,
} from "@webdino/profile-verify";

export const toProfile = (verifyResult: VerifyResult): Profile => {
  if (verifyResult instanceof ProfileGenericError) {
    const payload = verifyResult.result.payload;
    const profile = isJwtOpPayload(payload)
      ? toOp(payload)
      : toDp(payload as JwtDpPayload);
    return { ...profile, error: verifyResult };
  }

  return "op" in verifyResult ? verifyResult.op : verifyResult.dp;
};
