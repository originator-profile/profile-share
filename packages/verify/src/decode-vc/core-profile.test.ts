import { test, expect } from "vitest";
import { addYears } from "date-fns";
import { CoreProfile } from "@originator-profile/model";
import {
  VcDecoder,
  VcValidator,
} from "@originator-profile/jwt-securing-mechanism";
import { signCp, generateKey } from "@originator-profile/sign";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const coreProfile: CoreProfile = {
  type: ["VerifiableCredential"],
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
  ],
  issuer: "dns:example.org",
  credentialSubject: {
    id: "dns:example.com",
    type: "CoreProfile",
    jwks: {
      keys: [],
    },
  },
};

test("Core Profile のデコードに成功", async () => {
  const { privateKey } = await generateKey();
  const jwt = await signCp(coreProfile, privateKey, { issuedAt, expiredAt });
  const decoder = VcDecoder(VcValidator(CoreProfile));
  const decoded = decoder(jwt);
  expect(decoded).toStrictEqual(coreProfile);
});

test("無効な形式のJWTのときデコードに失敗", async () => {
  const invalidJwt = "invalid.jwt";
  const decoder = VcDecoder();
  const decoded = decoder(invalidJwt);
  expect(decoded).instanceOf(Error);
});
