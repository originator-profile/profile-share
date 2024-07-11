import { test, expect } from "vitest";
import { addYears, getUnixTime } from "date-fns";
import { OriginatorProfile } from "@originator-profile/model";
import { ValidatorService } from "./validator";

test("opValidate() return OP", () => {
  const validator = ValidatorService();
  const issuedAt = getUnixTime(new Date());
  const expiredAt = getUnixTime(addYears(new Date(), 10));
  const op: OriginatorProfile = {
    vct: "https://originator-profile.org/orgnization",
    "vct#integrity": "sha256",
    iss: "https://originator-profile.org",
    "iss#integrity": "sha256",
    sub: "localhost",
    locale: "ja-JP",
    issuer: {
      domain_name: "localhost",
      url: "https://originator-profile.org/",
      name: "Originator Profile 技術研究組合 (開発用)",
      corporate_number: "8010005035933",
      postal_code: "100-8055",
      contact_title: "お問い合わせ",
      contact_url: "https://originator-profile.org/ja-JP/inquiry/",
      privacy_policy_title: "プライバシーポリシー",
      privacy_policy_url: "https://originator-profile.org/ja-JP/privacy/",
      address: "東京都千代田区大手町1-7-1",
      country: "JP",
      logo: "https://originator-profile.org/image/icon.svg",
    },
    holder: {
      domain_name: "localhost",
      url: "https://originator-profile.org/",
      name: "Originator Profile 技術研究組合 (開発用)",
      corporate_number: "8010005035933",
      postal_code: "100-8055",
      contact_title: "お問い合わせ",
      contact_url: "https://originator-profile.org/ja-JP/inquiry/",
      privacy_policy_title: "プライバシーポリシー",
      privacy_policy_url: "https://originator-profile.org/ja-JP/privacy/",
      address: "東京都千代田区大手町1-7-1",
      country: "JP",
      logo: "https://originator-profile.org/image/icon.svg",
    },
    jwks: {
      keys: [
        // Publicly known test key
        // https://www.rfc-editor.org/rfc/rfc9500.html#section-2.3-2
        {
          kty: "EC",
          x: "QiVI-I-3gv-17KN0RFLHKh5Vj71vc75eSOkyMsxFxbE",
          y: "bEzRDEy41bihcTnpSILImSVymTQl9BQZq36QpCpJQnI",
          crv: "P-256",
          kid: "LIstkoCvByn4jk8oZPvigQkzTzO9UwnGnE-VMlkZvYQ",
        },
      ],
    },
    iat: issuedAt,
    exp: expiredAt,
  };
  const valid = validator.opValidate(op);
  expect(valid).toEqual(op);
});

test("jwkValidate() return JWK", () => {
  const validator = ValidatorService();
  const jwk = {
    kid: "pFZjqcvvx0zPQNalRuiWVy1Asr6iEqn2DVVJ2Z_0RXw",
    kty: "EC",
    x: "qdRrcTMY91Y14wEjKK8vsRD0URAvp4_iUeuNccLRXNM",
    y: "hapsGeufcGFeTlpBqVDXue-Iu3aO12gd1T9pvzQYFwc",
    crv: "P-256",
  };
  const valid = validator.jwkValidate(jwk);
  expect(valid).toEqual(jwk);
});
