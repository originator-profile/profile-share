import { LocalKeys } from "@originator-profile/cryptography";
import {
  ContentAttestation,
  ContentAttestationSet,
} from "@originator-profile/model";
import { JwtVcDecoder } from "@originator-profile/securing-mechanism";
import {
  CaInvalid,
  CaVerifier,
  CaVerifyFailed,
  CoreProfileNotFound,
  VerifiedOps,
  VerifyIntegrity,
} from "@originator-profile/verify";
import { CasVerifyFailed } from "./errors";
import {
  CasItem,
  CasVerificationResult,
  SupportedCa,
  VerifiedCas,
} from "./types";

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
      const main = hasMain && ca.main;
      const decodedCa = decodeCa(target);
      if (decodedCa instanceof Error) {
        return { main, attestation: new CaInvalid("Invalid CA", decodedCa) };
      }
      const cp = verifiedOps.find(
        (ops) => ops.core.doc.credentialSubject.id === decodedCa.doc.issuer,
      );
      if (!cp) {
        return {
          main,
          attestation: new CoreProfileNotFound(
            "Appropriate Core Profile not found",
            decodedCa,
          ),
        };
      }
      const verify = CaVerifier(
        target,
        LocalKeys(cp.core.doc.credentialSubject.jwks),
        decodedCa.doc.issuer,
        new URL(url),
        verifyIntegrity,
      );
      return { main: hasMain && ca.main, attestation: await verify() };
    }),
  );
  if (
    resultCas.some((ca) => {
      return (
        ca.attestation instanceof CaInvalid ||
        ca.attestation instanceof CoreProfileNotFound ||
        ca.attestation instanceof CaVerifyFailed
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

/** CAS の列挙 */
export function listCas(
  cas: VerifiedCas,
  type: "Article" | "OnlineAd" | "Main" | "Other" | "All",
): SupportedCa[] {
  let filtered: VerifiedCas;
  switch (type) {
    case "Article":
    case "OnlineAd": {
      filtered = cas.filter((ca) => {
        return ca.attestation.doc.credentialSubject.type === type;
      });
      break;
    }
    case "Main": {
      filtered = cas.filter((ca) => {
        const hasMain = hasMainProperty(ca);
        return hasMain && ca.main;
      });
      break;
    }
    case "Other": {
      filtered = cas.filter((ca) => {
        return (
          !ca.main && ca.attestation.doc.credentialSubject.type === "Article"
        );
      });
      break;
    }
    case "All":
    default: {
      filtered = cas;
      break;
    }
  }
  return filtered.map((ca) => ca.attestation.doc as SupportedCa);
}
