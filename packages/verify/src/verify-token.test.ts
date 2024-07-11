import { test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Dp, OriginatorProfile } from "@originator-profile/model";
import { signDp, generateKey, signSdJwtOp } from "@originator-profile/sign";
import { ProfileTokenVerifyFailed } from "./errors";
import { TokenDecoder } from "./decode";
import { LocalKeys } from "./keys";
import { TokenVerifier } from "./verify-token";

const iat = getUnixTime(new Date("2024-01-01T00:00:00Z"));
const exp = getUnixTime(addYears(new Date("2024-01-01T00:00:00Z"), 10));
const op: OriginatorProfile = {
  iat,
  exp,
  iss: "https://example.org",
  sub: "example.com",
  vct: "https://originator-profile.org/orgnization",
  "vct#integrity": "sha256",
  "iss#integrity": "sha256",
  locale: "ja-JP",
  jwks: { keys: [] },
  issuer: {
    domain_name: "example.org",
    url: "https://example.org/",
    name: "Example Organization",
    corporate_number: "1234567890123",
    postal_code: "123-4567",
    contact_title: "Contact",
    contact_url: "https://example.org/contact/",
    privacy_policy_title: "Privacy Policy",
    privacy_policy_url: "https://example.org/privacy/",
    country: "JP",
    logo: "https://example.org/logo.svg",
  },
  holder: {
    domain_name: "example.com",
    url: "https://example.com/",
    name: "Example",
    corporate_number: "1234567890123",
    postal_code: "123-4567",
    contact_title: "Contact",
    contact_url: "https://example.com/contact/",
    privacy_policy_title: "Privacy Policy",
    privacy_policy_url: "https://example.com/privacy/",
    country: "JP",
    logo: "https://example.com/logo.svg",
  },
};

test("verify OP Token", async () => {
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const origin = "https://example.com";
  const verifier = TokenVerifier(keys, "https://example.org", decoder, origin);
  const jwt = await signSdJwtOp(op, privateKey);
  const result = await verifier(jwt);
  expect(result).not.toBeInstanceOf(Error);
  // @ts-expect-error assert
  expect(result.op).toMatchSnapshot();
});

test("OP Token の issuer が検証者にとって未知ならば検証に失敗", async () => {
  const evilOp: OriginatorProfile = {
    ...op,
    iss: "https://evil.example.org",
    issuer: {
      ...op.issuer,
      domain_name: "evil.example.org",
    },
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const origin = "https://example.com";
  const verifier = TokenVerifier(keys, "https://example.org", decoder, origin);
  const jwt = await signSdJwtOp(evilOp, privateKey);
  const result = await verifier(jwt);
  expect(result).toBeInstanceOf(ProfileTokenVerifyFailed);
});

test("verify DP Token", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const dp: Dp = {
    type: "dp",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "example.com",
    subject: "https://example.com/article/42",
    item: [],
    allowedOrigins: ["https://example.com"],
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const origin = "https://example.com";
  const verifier = TokenVerifier(keys, "example.com", decoder, origin);
  const jwt = await signDp(dp, privateKey);
  const result = await verifier(jwt);
  // @ts-expect-error assert
  expect(result.dp).toEqual(dp);
});

test("DP Token の利用可能なオリジンに対象とするオリジンが含まれないならば検証に失敗", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const dp: Dp = {
    type: "dp",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "example.com",
    subject: "https://example.com/article/42",
    item: [],
    allowedOrigins: ["https://example.com"],
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const evilOrigin = "https://evil.example.com";
  const verifier = TokenVerifier(keys, "example.com", decoder, evilOrigin);
  const jwt = await signDp(dp, privateKey);
  const result = await verifier(jwt);
  expect(result).instanceOf(ProfileTokenVerifyFailed);
});

test("DP Token の issuer が検証者にとって未知ならば検証に失敗", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const dp: Dp = {
    type: "dp",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "evil.example.com",
    subject: "https://example.com/article/42",
    item: [],
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const origin = "https://example.com";
  const verifier = TokenVerifier(keys, "example.com", decoder, origin);
  const jwt = await signDp(dp, privateKey);
  const result = await verifier(jwt);
  expect(result).toBeInstanceOf(ProfileTokenVerifyFailed);
});
