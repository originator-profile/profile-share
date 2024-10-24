import { OpVc } from "@originator-profile/model";
import { JwtVcDecodingResult, JwtVcVerificationResult } from "./types";

export class JwtVcValidateFailed<T extends OpVc> extends Error {
  static get code() {
    return "ERR_JWT_VC_VALIDATION_FAILED";
  }
  readonly code = JwtVcValidateFailed.code;

  result: JwtVcDecodingResult<T>;

  constructor(message: string, result: JwtVcDecodingResult<T>) {
    super(message);
    this.result = result;
  }
}

export class JwtVcDecodeFailed<T extends OpVc> extends Error {
  static get code() {
    return "ERR_JWT_VC_DECODE_FAILED";
  }
  readonly code = JwtVcDecodeFailed.code;

  result: Omit<JwtVcDecodingResult<T>, "payload">;

  constructor(
    message: string,
    result: Omit<JwtVcDecodingResult<T>, "payload">,
  ) {
    super(message);
    this.result = result;
  }
}

export class JwtVcVerifyFailed<T extends OpVc> extends Error {
  static get code() {
    return "ERR_JWT_VC_VERIFY_FAILED";
  }
  readonly code = JwtVcVerifyFailed.code;

  result: JwtVcVerificationResult<T>;

  constructor(message: string, result: JwtVcVerificationResult<T>) {
    super(message);
    this.result = result;
  }
}
