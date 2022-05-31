import { ErrorObject } from "ajv";
import { JWTPayload } from "jose";
import { JOSEError } from "jose/dist/types/util/errors";
import { DecodeResult } from "./types";

export class ProfileGenericError extends Error {
  static get code() {
    return "ERR_PROFILE_GENERIC";
  }
  readonly code = ProfileGenericError.code;
}

export class ProfileClaimsValidationFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILE_CLAIMS_VALIDATION_FAILED" as const;
  }
  readonly code = ProfileClaimsValidationFailed.code;

  /** 復号結果 */
  result: {
    errors: ErrorObject[];
    payload: JWTPayload;
  };

  constructor(
    message: string,
    result: ProfileClaimsValidationFailed["result"]
  ) {
    super(message);
    this.result = result;
  }
}

export class ProfilesVerifyFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILES_VERIFY_FAILED" as const;
  }
  readonly code = ProfilesVerifyFailed.code;

  /** 検証結果 */
  result: Exclude<DecodeResult, ProfileClaimsValidationFailed>;

  constructor(message: string, result: ProfilesVerifyFailed["result"]) {
    super(message);
    this.result = result;
  }
}

export class ProfileTokenVerifyFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILE_TOKEN_VERIFY_FAILED" as const;
  }
  readonly code = ProfileTokenVerifyFailed.code;

  /** 検証結果 */
  result: ProfilesVerifyFailed["result"] & {
    error?: JOSEError;
  };

  constructor(message: string, result: ProfileTokenVerifyFailed["result"]) {
    super(message);
    this.result = result;
  }
}
