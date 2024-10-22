import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  JwtVcVerifier,
  VcDecoder,
  VcValidator,
} from "@originator-profile/jwt-securing-mechanism";
import { CoreProfile } from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import { addYears } from "date-fns";
import { describe, expect, test } from "vitest";

const VERIFIER_ID = "dns:example.org";
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

describe("CoreProfile のデコード", () => {
  test("検証に成功", async () => {
    const { publicKey, privateKey } = await generateKey();
    const keys = LocalKeys({ keys: [publicKey] });
    const validator = VcValidator(CoreProfile);
    const decoder = VcDecoder(validator);
    const verifier = JwtVcVerifier(keys, VERIFIER_ID, decoder);
    const jwt = await signCp(coreProfile, privateKey, { issuedAt, expiredAt });
    const result = await verifier(jwt);
    expect(result).not.toBeInstanceOf(Error);
    // @ts-expect-error assert
    expect(result.payload).toStrictEqual(coreProfile);
  });
});
