import {
  CaInvalid,
  CaVerifyFailed,
  CaVerifier,
  CoreProfileNotFound,
  VerifiedOps,
  VerifyIntegrity,
} from "@originator-profile/verify";
import {
  ContentAttestationSet,
  ContentAttestation,
} from "@originator-profile/model";
import { LocalKeys } from "@originator-profile/cryptography";
import { JwtVcDecoder } from "@originator-profile/securing-mechanism";
import { CasVerificationResult, VerifiedCas, CasItem } from "./types";
import { CasVerifyFailed } from "./errors";

/** main プロパティの有無 */
const hasMainProperty = <T>(ca: CasItem<T>): ca is Exclude<CasItem<T>, T> =>
  typeof ca === "object" && ca !== null && "main" in ca;

/**
 * Content Attestation Set の検証
 * @param cas Content Attestation Set
 * @param verifiedOps 検証済み Originator Profile Set
 * @param url 検証対象のURL
 * @param verifyIntegrity Target Integrity の検証器
 * @returns CAS 検証結果
 */
export async function verifyCas(
  cas: ContentAttestationSet,
  verifiedOps: VerifiedOps,
  url: string,
  verifyIntegrity: VerifyIntegrity,
): Promise<CasVerificationResult> {
  const decodeCa = JwtVcDecoder<ContentAttestation>();
  const resultCas = await Promise.all(
    cas.map(async (ca) => {
      const hasMain = hasMainProperty(ca);
      const target = hasMain ? ca.attestation : ca;
      const decodedCa = decodeCa(target);
      if (decodedCa instanceof Error) {
        return new CaInvalid("Invalid CA", decodedCa);
      }
      const cp = verifiedOps.find(
        (ops) => ops.core.doc.credentialSubject.id === decodedCa.doc.issuer,
      );
      if (!cp) {
        return new CoreProfileNotFound(
          "Appropriate Core Profile not found",
          decodedCa,
        );
      }
      const verify = CaVerifier(
        target,
        LocalKeys(cp.core.doc.credentialSubject.jwks),
        decodedCa.doc.issuer,
        new URL(url),
        verifyIntegrity,
      );
      return hasMain
        ? { main: ca.main, attestation: await verify() }
        : await verify();
    }),
  );
  if (
    resultCas.some((ca) => {
      const hasMain = hasMainProperty(ca);
      const resultCa = hasMain ? ca.attestation : ca;
      return (
        resultCa instanceof CaInvalid || resultCa instanceof CaVerifyFailed
      );
    })
  ) {
    return new CasVerifyFailed(
      "Content Attestation Set verify failed",
      resultCas,
    );
  }
  return resultCas as VerifiedCas;
}
