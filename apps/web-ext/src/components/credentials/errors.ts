import { CasVerificationFailure, FrameResponse } from "./types";

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

/**
 * クレデンシャルを取得するメッセージの通信に失敗
 *
 * 次のケースでこのエラーを使用します。
 *
 * - タブ内の各フレームとの通信に失敗しました。
 *
 * 次のケースではこのエラーは使用しません。
 *
 * - フレームでの OPS/CAS の取得に失敗しました。
 * - フレームの OPS/CAS が空です。
 **/
export class FetchCredentialsMessagingFailed extends Error {
  static get code() {
    return "ERR_FETCH_CREDENTIALS_MESSAGING_FAILED";
  }
  readonly code = FetchCredentialsMessagingFailed.code;

  constructor(
    message: string,
    public result: FrameResponse<{ error: Error }>,
  ) {
    super(message);
  }
}
