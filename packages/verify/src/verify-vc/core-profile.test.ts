import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  JwtVcVerifier,
  JwtVcDecoder,
  JwtVcValidator,
} from "@originator-profile/jwt-securing-mechanism";
import { CoreProfile } from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import { addYears, getUnixTime } from "date-fns";
import { expect, test } from "vitest";

const VERIFIER_ID = "dns:example.org";
const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const coreProfile: CoreProfile = {
  type: ["VerifiableCredential", "CoreProfile"],
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
  ],
  issuer: "dns:example.org",
  credentialSubject: {
    id: "dns:example.com",
    type: "Core",
    jwks: {
      keys: [
        {
          kty: "EC",
          x: "QiVI-I-3gv-17KN0RFLHKh5Vj71vc75eSOkyMsxFxbE",
          y: "bEzRDEy41bihcTnpSILImSVymTQl9BQZq36QpCpJQnI",
          crv: "P-256",
          kid: "LIstkoCvByn4jk8oZPvigQkzTzO9UwnGnE-VMlkZvYQ",
        },
      ],
    },
  },
};

test("CoreProfile の検証に成功", async () => {
  const { publicKey, privateKey } = await generateKey();
  const keys = LocalKeys({ keys: [publicKey] });
  const validator = JwtVcValidator(CoreProfile);
  const decoder = JwtVcDecoder(validator);
  const verifier = JwtVcVerifier(keys, VERIFIER_ID, decoder);
  const jwt = await signCp(coreProfile, privateKey, { issuedAt, expiredAt });
  const result = await verifier(jwt);
  expect(result).not.toBeInstanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toStrictEqual({
    ...coreProfile,
    iss: coreProfile.issuer,
    sub: coreProfile.credentialSubject.id,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
  });
});
