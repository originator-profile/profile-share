import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import { OpVc } from "@originator-profile/model";
import { addYears, subDays, subYears, getUnixTime } from "date-fns";
import { describe, expect, test } from "vitest";
import { JwtVcDecoder } from "./decode-vc";
import { signVc } from "./sign-vc";
import { JwtVcVerifier } from "./verify-vc";
import { JwtVcVerifyFailed } from "./errors";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const vc = {
  type: ["VerifiableCredential"],
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
  ],
  issuer: "dns:example.com",
  credentialSubject: {
    id: "dns:example.com",
    type: "CredentialSubject",
  },
} as const satisfies OpVc;

describe("JWT VC の検証", () => {
  test("検証に成功", async () => {
    const { publicKey, privateKey } = await generateKey();
    const keys = LocalKeys({ keys: [publicKey] });
    const decoder = JwtVcDecoder();
    const verifier = JwtVcVerifier(keys, "dns:example.com", decoder);
    const jwt = await signVc(vc, privateKey, { issuedAt, expiredAt });
    const result = await verifier(jwt);
    expect(result).not.toBeInstanceOf(Error);
    // @ts-expect-error assert
    expect(result.payload).toStrictEqual({
      ...vc,
      iss: vc.issuer,
      sub: vc.credentialSubject.id,
      iat: getUnixTime(issuedAt),
      exp: getUnixTime(expiredAt),
    });
  });

  test("VC の issuer が検証者にとって未知ならば検証に失敗", async () => {
    const evilProfile = {
      ...vc,
      issuer: "dns:evil.example.org",
    } as const satisfies OpVc;
    const { publicKey, privateKey } = await generateKey();
    const decoder = JwtVcDecoder();
    const keys = LocalKeys({ keys: [publicKey] });
    const verifier = JwtVcVerifier(keys, "dns:example.org", decoder);
    const jwt = await signVc(evilProfile, privateKey, {
      issuedAt,
      expiredAt,
    });
    const result = await verifier(jwt);
    expect(result).toBeInstanceOf(JwtVcVerifyFailed);
  });

  test("VC の有効期限が過ぎていれば検証に失敗", async () => {
    const expiredAt = subDays(new Date(), 1);
    const issuedAt = subYears(expiredAt, 1);
    const { publicKey, privateKey } = await generateKey();
    const decoder = JwtVcDecoder();
    const keys = LocalKeys({ keys: [publicKey] });
    const verifier = JwtVcVerifier(keys, "dns:example.org", decoder);
    const jwt = await signVc(vc, privateKey, { issuedAt, expiredAt });
    const result = await verifier(jwt);
    expect(result).toBeInstanceOf(JwtVcVerifyFailed);
  });
});
