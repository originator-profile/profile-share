import {
  VcDecodingFailure,
  VcValidationFailure,
  VcVerificationFailure,
} from "./types";

/** VC 検証失敗 */
export class VcVerifyFailed<T extends VcVerificationFailure> extends Error {
  static get code() {
    return "ERR_VC_VERIFY_FAILED";
  }
  readonly code = VcVerifyFailed.code;
  constructor(
    message: string,
    public result: T,
  ) {
    super(message);
  }
}

/** VC 復号失敗 */
export class VcDecodeFailed<T extends VcDecodingFailure> extends Error {
  static get code() {
    return "ERR_VC_DECODE_FAILED";
  }
  readonly code = VcDecodeFailed.code;

  constructor(
    message: string,
    public result: T,
  ) {
    super(message);
  }
}

/**
 * VC 妥当性確認失敗
 *
 * VC の妥当性確認に失敗しました。次の原因で使用されます。
 *
 * - データモデルへの適合性確認に失敗した
 *
 * */
export class VcValidateFailed<T extends VcValidationFailure> extends Error {
  static get code() {
    return "ERR_VC_VALIDATION_FAILED";
  }
  readonly code = VcValidateFailed.code;
  constructor(
    message: string,
    public result: T,
  ) {
    super(message);
  }
}
