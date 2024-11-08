import { JWTInvalid, JOSEError } from "jose/errors";
import { ValidationError } from "ajv";
import { OpVc } from "@originator-profile/model";
import {
  JwtVcDecodingResultPayload,
  JwtVcVerificationResultPayload,
} from "./types";

export class JwtVcValidateFailed<T extends OpVc> extends Error {
  static get code() {
    return "ERR_JWT_VC_VALIDATION_FAILED";
  }
  readonly code = JwtVcValidateFailed.code;

  constructor(
    message: string,
    public result: JwtVcDecodingResultPayload<T> & {
      error: ValidationError;
    },
  ) {
    super(message);
  }
}

export class JwtVcDecodeFailed<T extends OpVc> extends Error {
  static get code() {
    return "ERR_JWT_VC_DECODE_FAILED";
  }
  readonly code = JwtVcDecodeFailed.code;

  constructor(
    message: string,
    public result: Omit<JwtVcDecodingResultPayload<T>, "payload"> & {
      error: JWTInvalid;
    },
  ) {
    super(message);
  }
}

export class JwtVcVerifyFailed<T extends OpVc> extends Error {
  static get code() {
    return "ERR_JWT_VC_VERIFY_FAILED";
  }
  readonly code = JwtVcVerifyFailed.code;

  constructor(
    message: string,
    public result: JwtVcVerificationResultPayload<T> & { error: JOSEError },
  ) {
    super(message);
  }
}
