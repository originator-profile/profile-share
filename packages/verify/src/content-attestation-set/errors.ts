import { CasVerificationFailure } from "./types";

/**
 * Content Attestation Set 検証失敗
 *
 * Content Attestation Set の検証に失敗しました。詳細は result プロパティに格納される CaVerifyFailed クラスインスタンスのメッセージを確認してください。
 **/
export class CasVerifyFailed extends Error {
  static get code() {
    return "ERR_CONTENT_ATTESTATION_SET_VERIFY_FAILED";
  }
  readonly code = CasVerifyFailed.code;

  constructor(
    message: string,
    public result: CasVerificationFailure,
  ) {
    super(message);
  }
}
