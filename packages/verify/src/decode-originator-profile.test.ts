import { test, expect } from "vitest";
import { addYears, getUnixTime } from "date-fns";
import { generateKey } from "@originator-profile/cryptography";
import { OriginatorProfile } from "@originator-profile/model";
import { OriginatorProfileDecoder } from "./decode-originator-profile";
import { signSdJwtOp } from "@originator-profile/sign";

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

test("Originator Profile のデコードに成功", async () => {
  const { privateKey } = await generateKey();
  const sdJwt = await signSdJwtOp(originatorProfile, privateKey);
  const decoder = OriginatorProfileDecoder(null);
  const decoded = decoder(sdJwt);
  expect(decoded).toEqual(originatorProfile);
});

test("無効な形式のSD-JWTのときデコードに失敗", async () => {
  const invalidSdJwt = "invalid.sdJwt";
  const decoder = OriginatorProfileDecoder(null);
  const decoded = decoder(invalidSdJwt);
  expect(decoded).instanceOf(Error);
});
