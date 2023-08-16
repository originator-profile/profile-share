import { ErrorObject } from "ajv";
import { JWTPayload } from "jose";
import { JOSEError } from "jose/dist/types/util/errors";
import { DecodeResult, VerifyTokenResult } from "./types";

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
    error?: JOSEError;
    errors?: ErrorObject[];
    payload?: JWTPayload;
    jwt: string;
  };

  constructor(
    message: string,
    result: ProfileClaimsValidationFailed["result"],
  ) {
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
  result: Exclude<DecodeResult, ProfileGenericError> & {
    error?: JOSEError;
  };

  constructor(message: string, result: ProfileTokenVerifyFailed["result"]) {
    super(message);
    this.result = result;
  }
}

export class ProfileBodyExtractFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILE_BODY_EXTRACT_FAILED" as const;
  }
  readonly code = ProfileBodyExtractFailed.code;
}

export class ProfilesResolveFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILES_RESOLVE_FAILED" as const;
  }
  readonly code = ProfilesResolveFailed.code;

  /** 検証結果 */
  result: Exclude<DecodeResult, ProfileGenericError>;

  constructor(message: string, result: ProfilesResolveFailed["result"]) {
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
  result: Exclude<DecodeResult | VerifyTokenResult, ProfileGenericError>;

  constructor(message: string, result: ProfilesVerifyFailed["result"]) {
    super(message);
    this.result = result;
  }
}

export class ProfileUnsupportedFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILES_UNSUPPORT_FAILED" as const;
  }
  readonly code = ProfileUnsupportedFailed.code;

  /** 検証結果 */
  result: Exclude<DecodeResult | VerifyTokenResult, ProfileGenericError>;

  constructor(message: string, result: ProfileUnsupportedFailed["result"]) {
    super(message);
    this.result = result;
  }
}

export class ProfilesFetchFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILES_FETCH_FAILED" as const;
  }
  readonly code = ProfilesFetchFailed.code;
}
