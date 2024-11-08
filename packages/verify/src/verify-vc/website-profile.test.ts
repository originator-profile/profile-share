import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  JwtVcDecoder,
  JwtVcValidator,
  JwtVcVerifier,
  signVc,
} from "@originator-profile/jwt-securing-mechanism";
import { WebsiteProfile } from "@originator-profile/model";
import { addYears, getUnixTime } from "date-fns";
import { expect, test } from "vitest";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const websiteProfile: WebsiteProfile = {
  type: ["VerifiableCredential", "WebsiteProfile"],
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" },
  ],
  issuer: "dns:example.com",
  credentialSubject: {
    id: "https://media.example.com/",
    type: "WebSite",
    name: "<Webサイトのタイトル>",
    description: "<Webサイトの説明>",
    image: {
      id: "https://media.example.com/image.png",
      digestSRI: "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY=",
    },
    url: "https://media.example.com",
  },
};

test("Website Profile の検証に成功", async () => {
  const { publicKey, privateKey } = await generateKey();
  const keys = LocalKeys({ keys: [publicKey] });
  const validator = JwtVcValidator(WebsiteProfile);
  const decoder = JwtVcDecoder(validator);
  const verifier = JwtVcVerifier(keys, "dns:example.com", decoder);
  const jwt = await signVc(websiteProfile, privateKey, { issuedAt, expiredAt });
  const result = await verifier(jwt);
  expect(result).not.toBeInstanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toStrictEqual({
    ...websiteProfile,
    iss: websiteProfile.issuer,
    sub: websiteProfile.credentialSubject.id,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
  });
});
