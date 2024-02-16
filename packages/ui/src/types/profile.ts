import { Dp as DpModel, Op as OpModel } from "@originator-profile/model";
import * as errors from "@originator-profile/verify/src/errors";

export type ProfileError =
  | errors.ProfileClaimsValidationFailed
  | errors.ProfileTokenVerifyFailed
  | errors.ProfilesResolveFailed
  | errors.ProfilesVerifyFailed;

export type ProfileBodyError =
  | errors.ProfileBodyExtractFailed
  | errors.ProfileBodyVerifyFailed;

export type Op = OpModel & { error?: ProfileError };
export type Dp = DpModel & { error?: ProfileError } & {
  // 署名対象の文字列
  body?: string;
  // body の検証エラーの際のエラーメッセージ
  bodyError?: string;
  // body を取得した iframe の frameId の配列
  frameIds?: number[];
  // 最上位フレームに設置されているか否か
  containTopLevelFrame?: boolean;
};
export type Profile = Op | Dp;
