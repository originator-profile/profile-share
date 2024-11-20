import { SiteProfile, WebsiteProfile } from "@originator-profile/model";
import {
  JwtVcDecoder,
  JwtVcVerifier,
} from "@originator-profile/jwt-securing-mechanism";
import { Keys, LocalKeys } from "@originator-profile/cryptography";
import { OpsVerifier } from "../originator-profile-set/verify-ops";
import {
  CoreProfileNotFound,
  OpsInvalid,
  OpsVerifyFailed,
} from "../originator-profile-set/errors";
import { SpVerificationResult } from "./types";
import { SiteProfileInvalid, SiteProfileVerifyFailed } from "./verify-errors";

export function SpVerifier(sp: SiteProfile, keys: Keys, issuer: string) {
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
    const wspIssuer = decodedWsp.payload.issuer;
    const cp = opsVerified.find(
      (op) => op.core.payload.credentialSubject.id === wspIssuer,
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
      LocalKeys(cp.core.payload.credentialSubject.jwks),
      cp.core.payload.credentialSubject.id,
      decodeWsp,
    );

    const credential = await verifyWsp(sp.credential);
    if (credential instanceof Error) {
      return new SiteProfileVerifyFailed("Website Profile verify failed", {
        originators: opsVerified,
        credential,
      });
    }
    /* TODO: WebsiteProfile の url を検証する */
    return { originators: opsVerified, credential };
  }
  return verify;
}
