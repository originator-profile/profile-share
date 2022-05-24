import { JwtProfilePayload, Profile } from "../types/profile";
import { JwtVerifyError } from "../types/error";
import { isJwtOpPayload, toOp } from "./op";
import { toDp } from "./dp";

export const toProfile = (
  verifyResult: JwtProfilePayload | JwtVerifyError
): Profile => {
  if ("error" in verifyResult) {
    const { payload, error } = verifyResult;
    return isJwtOpPayload(payload)
      ? toOp(payload, error)
      : toDp(payload, error);
  }
  return isJwtOpPayload(verifyResult) ? toOp(verifyResult) : toDp(verifyResult);
};
