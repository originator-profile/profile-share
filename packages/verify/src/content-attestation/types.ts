import {
  JwtVcDecodingResult,
  JwtVcDecodingResultPayload,
  JwtVcVerificationResult,
  JwtVcVerificationResultPayload,
} from "@originator-profile/jwt-securing-mechanism";
import { ContentAttestation } from "@originator-profile/model";
import { CaVerifyFailed, CaInvalid } from "./errors";

/** Content Attestation 復号失敗 */
export type CaDecodingFailure = JwtVcDecodingResult<ContentAttestation>;
/** 復号済み Content Attestation */
export type DecodedCa = JwtVcDecodingResultPayload<ContentAttestation>;
/** Content Attestation 復号結果 */
export type CaDecodingResult = DecodedCa | CaInvalid;

/** Originator Profile 検証失敗 */
export type CaVerificationFailure = JwtVcVerificationResult<ContentAttestation>;
/** 検証済み Content Attestation */
export type VerifiedCa = JwtVcVerificationResultPayload<ContentAttestation>;
/** Content Attestation 検証結果 */
export type CaVerificationResult = VerifiedCa | CaVerifyFailed;
