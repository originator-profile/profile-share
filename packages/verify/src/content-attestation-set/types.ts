import { ContentAttestation } from "@originator-profile/model";
import { CaVerificationResult, VerifiedCa } from "../content-attestation";
import { CasVerifyFailed } from "./errors";

/** COntent Attestation Set 要素 */
export type CasItem<Ca> = { main: boolean; attestation: Ca };
/** 検証済み Content Attestation Set */
export type VerifiedCas<Ca extends ContentAttestation = ContentAttestation> =
  Array<CasItem<VerifiedCa<Ca>>>;
/** Content Attestation Set 検証失敗 */
export type CasVerificationFailure = Exclude<
  CasItem<CaVerificationResult>,
  CaVerificationResult
>[];
/** Content Attestation Set 検証結果 */
export type CasVerificationResult<
  T extends ContentAttestation = ContentAttestation,
> = VerifiedCas<T> | CasVerifyFailed;
