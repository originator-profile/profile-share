import { generateKey } from "@originator-profile/cryptography";
import { CoreProfile } from "@originator-profile/model";
import { addYears, getUnixTime } from "date-fns";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { expect, test } from "vitest";
import { signCp } from "./sign-cp";

test("signCp() return a valid JWT", async () => {
  const issuedAt = new Date();
  const expiredAt = addYears(new Date(), 10);
  const cp: CoreProfile = {
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
  const { publicKey, privateKey } = await generateKey();
  const jwt = await signCp(cp, privateKey, { issuedAt, expiredAt });
  expect(decodeProtectedHeader(jwt).kid).toBe(publicKey.kid);
  const valid = decodeJwt(jwt);
  expect(valid).toStrictEqual({
    iss: cp.issuer,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
    sub: cp.credentialSubject.id,
    ...cp,
  });
});
