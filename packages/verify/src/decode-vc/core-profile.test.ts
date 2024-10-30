import { test, expect } from "vitest";
import { addYears, getUnixTime } from "date-fns";
import { generateKey } from "@originator-profile/cryptography";
import { CoreProfile } from "@originator-profile/model";
import {
  JwtVcDecoder,
  JwtVcValidator,
  JwtVcDecodeFailed,
} from "@originator-profile/jwt-securing-mechanism";
import { signCp } from "@originator-profile/sign";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const coreProfile: CoreProfile = {
  type: ["VerifiableCredential", "CoreProfile"],
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    { "@language": "ja" },
  ],
  issuer: "dns:example.org",
  credentialSubject: {
    id: "dns:example.com",
    type: "Core",
    jwks: {
      keys: [],
    },
  },
};

test("Core Profile のデコードに成功", async () => {
  const { privateKey } = await generateKey();
  const jwt = await signCp(coreProfile, privateKey, { issuedAt, expiredAt });
  const decoder = JwtVcDecoder(JwtVcValidator(CoreProfile));
  const decoded = decoder(jwt);
  expect(decoded).not.instanceOf(Error);
  // @ts-expect-error assert
  expect(decoded.payload).toStrictEqual({
    ...coreProfile,
    iss: coreProfile.issuer,
    sub: coreProfile.credentialSubject.id,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
  });
});

test("無効な形式のJWTのときデコードに失敗", async () => {
  const invalidJwt = "invalid.jwt";
  const decoder = JwtVcDecoder();
  const decoded = decoder(invalidJwt);
  expect(decoded).instanceOf(JwtVcDecodeFailed);
});
