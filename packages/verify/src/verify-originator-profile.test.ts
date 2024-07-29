import { test, expect } from "vitest";
import { addYears, getUnixTime } from "date-fns";
import { generateKey, signSdJwtOp } from "@originator-profile/sign";
import { OriginatorProfile } from "@originator-profile/model";
import {
  OriginatorProfileDecoder,
  OriginatorProfileValidator,
} from "./decode-originator-profile";
import { OriginatorProfileVerifier } from "./verify-originator-profile";
import { LocalKeys } from "./keys";

const iat = getUnixTime(new Date());
const exp = getUnixTime(addYears(new Date(), 10));
const originatorProfile: OriginatorProfile = {
  iat,
  exp,
  iss: "https://example.org",
  sub: "example.com",
  vct: "https://originator-profile.org/organization",
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

test("Originator Profile の検証に成功", async () => {
  const { publicKey, privateKey } = await generateKey();
  const keys = LocalKeys({ keys: [publicKey] });
  const validator = OriginatorProfileValidator();
  const decoder = OriginatorProfileDecoder(validator);
  const verifier = OriginatorProfileVerifier(
    keys,
    "https://example.org",
    decoder,
  );
  const sdJwt = await signSdJwtOp(originatorProfile, privateKey);
  const result = await verifier(sdJwt);
  expect(result).not.toBeInstanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toEqual(originatorProfile);
});

test("Originator Profile の検証に成功 (ペイロードの検証はバイパス)", async () => {
  const { publicKey, privateKey } = await generateKey();
  const keys = LocalKeys({ keys: [publicKey] });
  const decoder = OriginatorProfileDecoder(null);
  const verifier = OriginatorProfileVerifier(
    keys,
    "https://example.org",
    decoder,
  );
  const sdJwt = await signSdJwtOp(originatorProfile, privateKey);
  const result = await verifier(sdJwt);
  expect(result).not.toBeInstanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toEqual(originatorProfile);
});

test("Originator Profile の issuer が検証者にとって未知ならば検証に失敗", async () => {
  const evilOriginatorProfile: OriginatorProfile = {
    ...originatorProfile,
    iss: "https://evil.example.org",
    issuer: {
      ...originatorProfile.issuer,
      domain_name: "evil.example.org",
    },
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = OriginatorProfileDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const verifier = OriginatorProfileVerifier(
    keys,
    "https://example.org",
    decoder,
  );
  const jwt = await signSdJwtOp(evilOriginatorProfile, privateKey);
  const result = await verifier(jwt);
  expect(result).toBeInstanceOf(Error);
});
