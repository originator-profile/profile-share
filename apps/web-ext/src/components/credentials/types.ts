import { CaVerificationResult, VerifiedCa } from "@originator-profile/verify";
import { CasVerifyFailed } from "./errors";
import { FetchCredentialsResult } from "@originator-profile/presentation";
import {
  OriginatorProfileSet,
  ContentAttestationSet,
} from "@originator-profile/model";

export type CasItem<T> = T | { main: boolean; attestation: T };
export type VerifiedCas = CasItem<VerifiedCa>[];
export type CasVerificationFailure = CasItem<CaVerificationResult>[];
export type CasVerificationResult = VerifiedCas | CasVerifyFailed;
export type CasProps = { cas: VerifiedCas };

export type DocumentLocation = { origin: string; url: string };
export type FetchCredentialsMessageResponse = {
  data: FetchCredentialsResult;
} & DocumentLocation;
export type FrameResponse<T> = T & { frameId: number; parentFrameId: number };
export type FetchCredentialsMessageFrameResponse = FrameResponse<
  FetchCredentialsMessageResponse & {
    data: Exclude<FetchCredentialsResult, Error>;
  }
>;
export type FrameCredentials = FrameResponse<
  {
    ops: OriginatorProfileSet;
    cas: ContentAttestationSet;
  } & DocumentLocation
>;
export type TabCredentials = FrameCredentials & { frames: FrameCredentials[] };
