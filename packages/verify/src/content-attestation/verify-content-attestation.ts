import { Keys } from "@originator-profile/cryptography";
import {
  JwtVcDecodeFailed,
  JwtVcDecoder,
  JwtVcVerifyFailed,
  JwtVcVerifier,
  JwtVcValidateFailed,
  JwtVcVerificationResultPayload,
} from "@originator-profile/jwt-securing-mechanism";
import { ContentAttestation } from "@originator-profile/model";
import { CaInvalid, CaVerifyFailed } from "./errors";
import { CaVerificationResult } from "./types";
import { verifyAllowedOrigin } from "../verify-allowed-origin";
import { verifyAllowedUrl } from "../verify-allowed-url";
import { verifyIntegrity } from "../integrity";

async function checkUrlAndOrigin(
  result: JwtVcVerificationResultPayload<ContentAttestation>,
  url: URL,
) {
  if (result.payload.allowedUrl && result.payload.allowedOrigin) {
    return new CaInvalid("allowedUrl and allowedOrigin are exclusive", result);
  }
  if (
    result.payload.allowedUrl &&
    !(await verifyAllowedUrl(url.toString(), result.payload.allowedUrl))
  ) {
    return new CaVerifyFailed("URL not allowed", result);
  }
  if (
    result.payload.allowedOrigin &&
    !verifyAllowedOrigin(url.origin, result.payload.allowedOrigin)
  ) {
    return new CaVerifyFailed("Origin not allowed", result);
  }
  return result;
}

/**
 * Content Attestation 検証機の作成
 * @param ca Content Attestation
 * @param keys Content Attestation の発行者の検証鍵
 * @param issuer Content Attestation の発行者
 * @param url 検証対象のURL
 * @returns 検証機
 */
export function CaVerifier(
  ca: string,
  keys: Keys,
  issuer: string,
  url: URL,
  decoder: JwtVcDecoder<ContentAttestation>,
) {
  const verifyCa = JwtVcVerifier<ContentAttestation>(keys, issuer, decoder);
  return async (): Promise<CaVerificationResult> => {
    const result = await verifyCa(ca);
    if (
      result instanceof JwtVcDecodeFailed ||
      result instanceof JwtVcValidateFailed
    ) {
      return new CaInvalid("Content Attestation decode failed", result);
    }
    if (result instanceof JwtVcVerifyFailed) {
      return new CaVerifyFailed("Content Attestation verify failed", result);
    }
    const urlResult = await checkUrlAndOrigin(result, url);
    if (urlResult instanceof Error) {
      return urlResult;
    }
    if (urlResult.payload.target) {
      if (urlResult.payload.target.length === 0) {
        return new CaInvalid("Target is empty", urlResult);
      }
      const integrityResults = await Promise.all(
        urlResult.payload.target.map(async (t, index) => ({
          index,
          isValid: await verifyIntegrity(t),
        })),
      );

      const failedIndices = integrityResults
        .filter((result) => !result.isValid)
        .map((result) => result.index);

      if (failedIndices.length > 0) {
        return new CaVerifyFailed(
          `Target integrity verification failed for element(s): ${failedIndices.join(", ")}`,
          urlResult,
        );
      }
    }
    return urlResult;
  };
}
