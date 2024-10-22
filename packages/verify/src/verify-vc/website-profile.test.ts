import {
  JwtVcVerifier,
  signVc,
  VcDecoder,
  VcValidator,
} from "@originator-profile/jwt-securing-mechanism";
import { WebsiteProfile } from "@originator-profile/model";
import { generateKey } from "@originator-profile/sign";
import { addYears } from "date-fns";
import { expect, test } from "vitest";
import { LocalKeys } from "@originator-profile/cryptography";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const websiteProfile: WebsiteProfile = {
  type: ["VerifiableCredential"],
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    { "@language": "ja" },
  ],
  issuer: "dns:example.com",
  credentialSubject: {
    id: "dns:example.com",
    type: "WebsiteProperties",
    title: "<Webサイトのタイトル>",
    description: "<Webサイトの説明>",
    image: {
      id: "https://media.example.com/image.png",
      digestSRI: "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY=",
    },
    origin: "https://media.example.com",
  },
};

test("Website Profile の検証に成功", async () => {
  const { publicKey, privateKey } = await generateKey();
  const keys = LocalKeys({ keys: [publicKey] });
  const validator = VcValidator(WebsiteProfile);
  const decoder = VcDecoder(validator);
  const verifier = JwtVcVerifier(keys, "dns:example.com", decoder);
  const jwt = await signVc(websiteProfile, privateKey, { issuedAt, expiredAt });
  const result = await verifier(jwt);
  expect(result).not.toBeInstanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toStrictEqual(websiteProfile);
});
