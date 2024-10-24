import { WebMediaProfile } from "@originator-profile/model";
import {
  signVc,
  JwtVcVerifier,
  JwtVcDecoder,
  JwtVcValidator,
} from "@originator-profile/jwt-securing-mechanism";
import { addYears, getUnixTime } from "date-fns";
import { describe, expect, test } from "vitest";
import { generateKey, LocalKeys } from "@originator-profile/cryptography";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const webMediaProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" },
  ],
  type: ["VerifiableCredential", "WebMediaProfile"],
  issuer: "dns:wmp-issuer.example.org",
  credentialSubject: {
    id: "dns:wmp-holder.example.jp",
    type: "WebMediaProfileProperties",
    url: "https://www.wmp-holder.example.jp/",
    name: "○○メディア (※開発用サンプル)",
    logo: {
      id: "https://www.wmp-holder.example.jp/logo.svg",
      digestSRI: "sha256-...",
    },
    email: "contact@wmp-holder.example.jp",
    telephone: "0000000000",
    contactPage: {
      type: "WebPage",
      id: "https://wmp-holder.example.jp/contact",
      name: "お問い合わせ",
    },
    privacyPolicyPage: {
      type: "WebPage",
      id: "https://wmp-holder.example.jp/privacy",
      name: "プライバシーポリシー",
    },
    publishingPrinciplePage: {
      type: "WebPage",
      id: "https://wmp-holder.example.jp/statement",
      name: "新聞倫理綱領",
    },
    description: {
      type: "PlainTextDescription",
      data: "この文章はこの Web メディアに関する補足情報です。",
    },
  },
} as const satisfies WebMediaProfile;

describe("WebMediaProfile の検証", () => {
  test("検証に成功", async () => {
    const { publicKey, privateKey } = await generateKey();
    const keys = LocalKeys({ keys: [publicKey] });
    const validator = JwtVcValidator(WebMediaProfile);
    const decoder = JwtVcDecoder(validator);
    const verifier = JwtVcVerifier(keys, "dns:wmp-issuer.example.org", decoder);
    const jwt = await signVc(webMediaProfile, privateKey, {
      issuedAt,
      expiredAt,
    });
    const result = await verifier(jwt);
    expect(result).not.toBeInstanceOf(Error);
    // @ts-expect-error assert
    expect(result.payload).toStrictEqual({
      ...webMediaProfile,
      iss: webMediaProfile.issuer,
      sub: webMediaProfile.credentialSubject.id,
      iat: getUnixTime(issuedAt),
      exp: getUnixTime(expiredAt),
    });
  });
});
