import { Op as OpModel, Dp as DpModel } from "@originator-profile/model";
import * as errors from "@originator-profile/verify/src/errors";
import { Role } from "./role";

export type ProfileError =
  | errors.ProfileClaimsValidationFailed
  | errors.ProfileTokenVerifyFailed
  | errors.ProfilesResolveFailed
  | errors.ProfilesVerifyFailed;

export type ProfileBodyError =
  | errors.ProfileBodyExtractFailed
  | errors.ProfileBodyVerifyFailed;

/** @deprecated */
export type Op = OpModel & { error?: ProfileError };
/** @deprecated */
export type Dp = DpModel & { error?: ProfileError };
/** @deprecated */
export type ProfilePayload = Op | Dp;

export type DpMetadata = {
  // 署名対象の文字列
  body?: string;
  // body の検証エラーの際のエラーメッセージ
  bodyError?: string;
  // メインの出版物か否か
  isMain: boolean;
  // body を取得した iframe の frameId の配列
  frameIds?: number[];
  // 最上位フレームに設置されているか否か
  containTopLevelFrame?: boolean;
};

export type OpMetadata = {
  // 組織のロール（複数可）
  roles: Role[];
};

export type ProfileMetadata = DpMetadata | OpMetadata;

export type DpPayloadWithMetadata = {
  profile: Dp;
  metadata: DpMetadata;
};

export type OpPayloadWithMetadata = {
  profile: Op;
  metadata: OpMetadata;
};

export type ProfilePayloadWithMetadata =
  | DpPayloadWithMetadata
  | OpPayloadWithMetadata;
