import { Keys } from "@originator-profile/cryptography";
import {
  VcValidator,
  VcVerifyFailed,
  JwtVcVerifier,
  VcValidateFailed,
} from "@originator-profile/securing-mechanism";
import { ContentAttestation } from "@originator-profile/model";
import { CaInvalid, CaVerifyFailed } from "./errors";
import { CaVerificationResult, VerifiedCa } from "./types";
import { verifyAllowedOrigin } from "../verify-allowed-origin";
import { verifyAllowedUrl } from "../verify-allowed-url";
import {
  verifyIntegrity as nativeVerifyIntegrity,
  VerifyIntegrity,
} from "../integrity";

async function checkUrlAndOrigin<T extends ContentAttestation>(
  result: VerifiedCa<T>,
  url: URL,
) {
  if (result.doc.allowedUrl && result.doc.allowedOrigin) {
    return new CaInvalid("allowedUrl and allowedOrigin are exclusive", result);
  }
  if (
    result.doc.allowedUrl &&
    !(await verifyAllowedUrl(url.toString(), result.doc.allowedUrl))
  ) {
    return new CaVerifyFailed("URL not allowed", result);
  }
  if (
    result.doc.allowedOrigin &&
    !verifyAllowedOrigin(url.origin, result.doc.allowedOrigin)
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
 * @param verifyIntegrity Target Integrity の検証器
 * @param validator バリデーター
 * @returns 検証機
 */
export function CaVerifier<T extends ContentAttestation>(
  ca: string,
  keys: Keys,
  issuer: string,
  url: URL,
  verifyIntegrity: VerifyIntegrity = nativeVerifyIntegrity,
  validator?: VcValidator<VerifiedCa<T>>,
) {
  const verifyCa = JwtVcVerifier<T>(keys, issuer, validator);
  return async (): Promise<CaVerificationResult<T>> => {
    const result = await verifyCa(ca);
    if (result instanceof VcValidateFailed) {
      return new CaInvalid("Content Attestation validate failed", result);
    }
    if (result instanceof VcVerifyFailed) {
      return new CaVerifyFailed("Content Attestation verify failed", result);
    }
    const urlResult = await checkUrlAndOrigin(result, url);
    if (urlResult instanceof Error) {
      return urlResult;
    }
    if (urlResult.doc.target) {
      if (urlResult.doc.target.length === 0) {
        return new CaInvalid("Target is empty", urlResult);
      }
      const integrityResults = await Promise.all(
        urlResult.doc.target.map(async (t, index) => ({
          index,
          isValid: await verifyIntegrity(t),
        })),
      );

      const failedIndices = integrityResults
        .filter((result) => !result.isValid)
        .map((result) => result.index);

      if (failedIndices.length > 0) {
        return new CaVerifyFailed(
          `Content Attestation Target integrity verification failed for element(s): ${failedIndices.map((i) => `target[${i}]`).join(", ")}`,
          urlResult,
        );
      }
    }
    return urlResult;
  };
}
