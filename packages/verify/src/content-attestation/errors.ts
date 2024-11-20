import { CaDecodingFailure, CaVerificationFailure } from "./types";

/**
 * Content Attestation 無効
 *
 * Content Attestation が無効な形式です。詳細は result プロパティに格納される CaInvalid クラスインスタンスのメッセージを確認してください。
 */
export class CaInvalid extends Error {
  static get code() {
    return "ERR_CONTENT_ATTESTATION_INVALID";
  }
  readonly code = CaInvalid.code;

  constructor(
    message: string,
    public result: CaDecodingFailure,
  ) {
    super(message);
  }
}

/**
 * Content Attestation 検証失敗
 *
 * Content Attestation の検証に失敗しました。詳細は result プロパティに格納される CaVerifyFailed クラスインスタンスのメッセージを確認してください。
 **/
export class CaVerifyFailed extends Error {
  static get code() {
    return "ERR_CONTENT_ATTESTATION_VERIFY_FAILED";
  }
  readonly code = CaVerifyFailed.code;

  constructor(
    message: string,
    public result: CaVerificationFailure,
  ) {
    super(message);
  }
}
