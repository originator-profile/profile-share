import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  JwtVcDecoder,
  JwtVcValidator,
  signVc,
} from "@originator-profile/jwt-securing-mechanism";
import { ContentAttestation } from "@originator-profile/model";
import { addYears, getUnixTime } from "date-fns";
import { describe, expect, test } from "vitest";
import { CaInvalid, CaVerifyFailed } from "./errors";
import { CaVerifier } from "./verify-content-attestation";
import { diffApply } from "just-diff-apply";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const signOptions = { issuedAt, expiredAt };
const toVerifyResult = (ca: ContentAttestation, jwt: string) => ({
  payload: {
    ...ca,
    iss: ca.issuer,
    sub: ca.credentialSubject.id,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
  },
  jwt,
});
const patch = <T extends object>(...args: Parameters<typeof diffApply<T>>) => {
  const [source, diff] = args;
  const patched = structuredClone(source);
  diffApply(patched, diff);
  return patched;
};
const caIssuer = "dns:ca-issuer.example.org" as const;
const caId = "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b" as const;
const caUrl = new URL("https://www.example.org/example");
const ca: ContentAttestation = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
  ],
  type: ["VerifiableCredential", "ContentAttestation"],
  issuer: caIssuer,
  credentialSubject: {
    id: caId,
    type: "anCA",
  },
};

describe("Content Attestationの検証", async () => {
  const decoder = JwtVcDecoder<ContentAttestation>();
  const issuer = await generateKey();
  const signedCa = await signVc(ca, issuer.privateKey, signOptions);

  test("Content Attestationの検証に成功", async () => {
    const verifier = CaVerifier(
      signedCa,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      decoder,
    );
    const result = await verifier();
    expect(result).not.instanceOf(CaInvalid);
    expect(result).not.instanceOf(CaVerifyFailed);
    expect(result).toStrictEqual(toVerifyResult(ca, signedCa));
  });

  test("Content Attestationの復号に失敗", async () => {
    const verifier = CaVerifier(
      "",
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      decoder,
    );
    const result = await verifier();
    expect(result).instanceOf(CaInvalid);
  });

  test("Content Attestationの検証に失敗", async () => {
    const verifier = CaVerifier(
      signedCa,
      LocalKeys({ keys: [issuer.publicKey] }),
      "evil-issuer.example.org",
      caUrl,
      decoder,
    );
    const result = await verifier();
    expect(result).instanceOf(CaVerifyFailed);
  });

  test("Content Attestationの検証でスキーマにあっていない", async () => {
    const invalidCa = patch(ca, [
      {
        op: "replace",
        path: ["type"],
        value: ["InvalidCredential"],
      },
    ]);
    const signedInvalidCa = await signVc(
      invalidCa,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedInvalidCa,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      JwtVcDecoder<ContentAttestation>(JwtVcValidator(ContentAttestation)),
    );
    const result = await verifier();
    expect(result).instanceOf(CaInvalid);
  });

  test("Content Attestationの検証でallowedUrlとallowedOriginが同時に指定されている", async () => {
    const invalidCa = patch(ca, [
      {
        op: "add",
        path: ["allowedUrl"],
        value: ["https://example.org"],
      },
      {
        op: "add",
        path: ["allowedOrigin"],
        value: ["https://example.org"],
      },
    ]);
    const signedInvalidCa = await signVc(
      invalidCa,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedInvalidCa,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      decoder,
    );
    const result = await verifier();
    expect(result).instanceOf(CaInvalid);
  });
});
