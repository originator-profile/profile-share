import {
  ContentAttestationSet,
  OriginatorProfileSet,
} from "@originator-profile/model";
import { CaVerificationResult, VerifiedCa } from "@originator-profile/verify";
import { CasVerifyFailed } from "./errors";

export type CasItem<T> = T | { main: boolean; attestation: T };
export type VerifiedCas = CasItem<VerifiedCa>[];
export type CasVerificationFailure = CasItem<CaVerificationResult>[];
export type CasVerificationResult = VerifiedCas | CasVerifyFailed;
export type CasProps = { cas: VerifiedCas };

export type FrameLocation = { origin: string; url: string };

export type FetchCredentialsMessageResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      /** シリアライズした Error クラスインスタンスの中身  */
      error: string;
    };

export type FetchCredentialsMessageResponse = FrameLocation & {
  ops: FetchCredentialsMessageResult<OriginatorProfileSet>;
  cas: FetchCredentialsMessageResult<ContentAttestationSet>;
};
export type FrameResponse<T = unknown> = T & {
  frameId: number;
  parentFrameId: number;
};
export type FrameCredentials = FrameResponse<
  {
    ops: OriginatorProfileSet;
    cas: ContentAttestationSet;
    error: {
      /** OPS 取得失敗 (失敗時 OPS は未設置とみなします) */
      ops?: Error;
      /** CAS 取得失敗 (失敗時 CAS は未設置とみなします) */
      cas?: Error;
    };
  } & FrameLocation
>;
export type TabCredentials = FrameCredentials & { frames: FrameCredentials[] };
