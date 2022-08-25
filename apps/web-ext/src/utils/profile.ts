import { Profile } from "../types/profile";
import { VerifyResult, ProfileGenericError } from "@webdino/profile-verify";
import { JwtDpPayload } from "@webdino/profile-model";
import {
  isOp,
  fromJwtDpPayload,
  fromJwtOpPayload,
  isJwtOpPayload,
} from "@webdino/profile-core";

export const toProfile = (verifyResult: VerifyResult): Profile => {
  if (verifyResult instanceof ProfileGenericError) {
    const payload = verifyResult.result.payload ?? {};
    const profile = isJwtOpPayload(payload)
      ? fromJwtOpPayload(payload)
      : fromJwtDpPayload(payload as JwtDpPayload);
    return { ...profile, error: verifyResult };
  }

  return "op" in verifyResult ? verifyResult.op : verifyResult.dp;
};

const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const sortProfiles = (
  profiles: Profile[],
  main: string[]
): Profile[] => {
  const mainIndex = profiles.findIndex(
    (profile) => profile.subject === main[0]
  );
  if (mainIndex !== -1) return reorder(profiles, mainIndex, 0);
  const opIndex = profiles.findIndex(isOp);
  if (opIndex !== -1) return reorder(profiles, opIndex, 0);
  return profiles;
};
