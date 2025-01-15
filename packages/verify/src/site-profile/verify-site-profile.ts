import { SiteProfile, WebsiteProfile } from "@originator-profile/model";
import {
  JwtVcDecoder,
  JwtVcVerifier,
} from "@originator-profile/securing-mechanism";
import { Keys, LocalKeys } from "@originator-profile/cryptography";
import { OpsVerifier } from "../originator-profile-set/verify-ops";
import {
  CoreProfileNotFound,
  OpsInvalid,
  OpsVerifyFailed,
} from "../originator-profile-set/errors";
import { SpVerificationResult } from "./types";
import { SiteProfileInvalid, SiteProfileVerifyFailed } from "./verify-errors";
import { verifyAllowedOrigin } from "../verify-allowed-origin";

export function SpVerifier(
  sp: SiteProfile,
  keys: Keys,
  issuer: string,
  origin: URL["origin"],
) {
  async function verify(): Promise<SpVerificationResult> {
    const verifyOps = OpsVerifier(sp.originators, keys, issuer);
    const opsVerified = await verifyOps();
    if (opsVerified instanceof OpsInvalid) {
      return new SiteProfileInvalid("Originator Profile Set invalid", {
        originators: opsVerified,
      });
    }
    if (opsVerified instanceof OpsVerifyFailed) {
      return new SiteProfileVerifyFailed(
        "Originator Profile Set verify failed",
        { originators: opsVerified },
      );
    }
    const decodeWsp = JwtVcDecoder<WebsiteProfile>();
    const decodedWsp = decodeWsp(sp.credential);
    if (decodedWsp instanceof Error) {
      return new SiteProfileInvalid("Website Profile invalid", {
        originators: opsVerified,
        credential: decodedWsp,
      });
    }
    const wspIssuer = decodedWsp.doc.issuer;
    const cp = opsVerified.find(
      (op) => op.core.doc.credentialSubject.id === wspIssuer,
    );
    if (!cp) {
      return new SiteProfileInvalid("Appropriate Core Profile not found", {
        originators: opsVerified,
        credential: new CoreProfileNotFound<WebsiteProfile>(
          `Missing Core Profile (${wspIssuer})`,
          decodedWsp,
        ),
      });
    }
    const verifyWsp = JwtVcVerifier<WebsiteProfile>(
      LocalKeys(cp.core.doc.credentialSubject.jwks),
      cp.core.doc.credentialSubject.id,
    );

    const credential = await verifyWsp(sp.credential);
    if (credential instanceof Error) {
      return new SiteProfileVerifyFailed("Website Profile verify failed", {
        originators: opsVerified,
        credential,
      });
    }

    if (!verifyAllowedOrigin(origin, decodedWsp.doc.credentialSubject.url)) {
      return new SiteProfileVerifyFailed("Origin not allowed", {
        originators: opsVerified,
        credential,
      });
    }

    return { originators: opsVerified, credential };
  }
  return verify;
}
