import { beforeEach, describe, test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import * as changeKeys from "change-case/keys";
import { Dp, OriginatorProfile } from "@originator-profile/model";
import {
  signOp,
  signDp,
  generateKey,
  signSdJwtOp,
} from "@originator-profile/sign";
import {
  ProfileClaimsValidationFailed,
  ProfilesVerifyFailed,
  ProfileTokenVerifyFailed,
  ProfilesResolveFailed,
} from "./errors";
import { LocalKeys } from "./keys";
import { SignedProfileValidator } from "./decode";
import { ProfilesVerifier } from "./verify-profiles";

interface VerifyProfileTestContext {
  certKeys: Awaited<ReturnType<typeof generateKey>>;
  subKeys: Awaited<ReturnType<typeof generateKey>>;
  op: OriginatorProfile;
  dp: Dp;
  opToken: string;
  dpToken: string;
  registryKeys: ReturnType<typeof LocalKeys>;
}

const iat = getUnixTime(new Date("2024-01-01T00:00:00"));
const exp = getUnixTime(addYears(new Date("2024-01-01T00:00:00"), 10));
const op: OriginatorProfile = {
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

const expected = {
  op: {
    issuer: op.iss,
    subject: op.sub,
    item: [
      // @ts-expect-error Spread types may only be created from object types  tsc/config
      { type: "holder", ...changeKeys.camelCase(op.holder) },
      // @ts-expect-error Spread types may only be created from object types  tsc/config
      { type: "certifier", ...changeKeys.camelCase(op.issuer) },
    ],
  },
};

describe("verify-profiles", () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const origin = "https://example.com";

  beforeEach<VerifyProfileTestContext>(async (context) => {
    const certKeys = (context.certKeys = await generateKey());
    const subKeys = (context.subKeys = await generateKey());
    const dp = (context.dp = {
      type: "dp",
      issuedAt: fromUnixTime(iat).toISOString(),
      expiredAt: fromUnixTime(exp).toISOString(),
      issuer: "example.com",
      subject: "https://example.com/article/42",
      item: [],
      allowedOrigins: ["https://example.com"],
    });
    const opWithKeys = { ...op, jwks: { keys: [subKeys.publicKey] } };
    context.op = opWithKeys;
    context.opToken = await signSdJwtOp(opWithKeys, certKeys.privateKey);
    context.dpToken = await signDp(dp, subKeys.privateKey);
    context.registryKeys = LocalKeys({ keys: [certKeys.publicKey] });
  });

  test<VerifyProfileTestContext>("Verify Profiles", async ({
    op,
    dp,
    opToken,
    dpToken,
    registryKeys,
  }) => {
    const verifier = ProfilesVerifier(
      { profile: [opToken, dpToken] },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const verified = await verifier();
    expect(verified[0]).toMatchObject({
      op: {
        issuer: op.iss,
        subject: op.sub,
        item: [
          // @ts-expect-error Spread types may only be created from object types  tsc/config
          { type: "holder", ...changeKeys.camelCase(op.holder) },
          // @ts-expect-error Spread types may only be created from object types  tsc/config
          { type: "certifier", ...changeKeys.camelCase(op.issuer) },
        ],
      },
    });
    expect(verified[1]).toMatchObject({ dp });
  });

  test<VerifyProfileTestContext>("OPの検証に失敗すると子も検証に失敗", async ({
    op,
    dpToken,
    registryKeys,
  }) => {
    const evilKeys = await generateKey();
    const evilOpToken = await signSdJwtOp(op, evilKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [evilOpToken, dpToken] },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const results = await verifier();
    expect(results[0]).instanceOf(ProfileTokenVerifyFailed);
    expect(results[0]).not.haveOwnProperty("op");
    expect(results[1]).instanceOf(ProfilesResolveFailed);
    expect(results[1]).not.haveOwnProperty("dp");
  });

  test<VerifyProfileTestContext>("不正なitemが含まれるときClaims Setの確認に失敗 (要 SignedProfileValidator)", async ({
    certKeys,
    subKeys,
    op,
    registryKeys,
  }) => {
    const signedProfileValidator = SignedProfileValidator();
    const invalidOp = {
      issuedAt: fromUnixTime(iat).toISOString(),
      expiredAt: fromUnixTime(exp).toISOString(),
      issuer: "https://example.org",
      subject: "example.com",
      item: ["invalid"],
      jwks: { keys: [subKeys.publicKey] },
    };
    // @ts-expect-error invalid Op
    const invalidOpToken = await signOp(invalidOp, certKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [invalidOpToken] },
      registryKeys,
      op.iss,
      signedProfileValidator,
      origin,
    );
    const results = await verifier();
    expect(results[0]).instanceOf(ProfileClaimsValidationFailed);
  });

  test<VerifyProfileTestContext>("不正な公開鍵のときJWTの検証に失敗", async ({
    certKeys,
    op,
    dpToken,
    registryKeys,
  }) => {
    const evilKeys = await generateKey();
    const evilOp: OriginatorProfile = {
      ...op,
      jwks: { keys: [evilKeys.publicKey] },
    };
    const evilOpToken = await signSdJwtOp(evilOp, certKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [evilOpToken, dpToken] },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const results = await verifier();
    expect(results[1]).instanceOf(ProfileTokenVerifyFailed);
  });

  test<VerifyProfileTestContext>("重複するJWTは取り除く", async ({
    op,
    dp,
    opToken,
    dpToken,
    registryKeys,
  }) => {
    const verifier = ProfilesVerifier(
      { profile: [opToken, opToken, dpToken] },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const results = await verifier();
    expect(results.length).toBe(2);
    expect(results[0]).toMatchObject({ op: { ...expected.op, jwks: op.jwks } });
    expect(results[1]).toMatchObject({ dp });
    expect(results[0]).not.toEqual(results[1]);
  });

  test<VerifyProfileTestContext>("DPの持たないOPが存在するときProfile Setの検証に失敗", async ({
    op,
    opToken,
    registryKeys,
  }) => {
    const verifier = ProfilesVerifier(
      { profile: [opToken] },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const results = await verifier();
    expect(results[0]).instanceOf(ProfilesVerifyFailed);
  });

  test<VerifyProfileTestContext>("DPの検証に失敗するとその親のOPも検証に失敗", async ({
    op,
    dp,
    opToken,
    registryKeys,
  }) => {
    const evilKeys = await generateKey();
    const evilDpToken = await signDp(dp, evilKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [opToken, evilDpToken] },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const results = await verifier();
    expect(results[0]).instanceOf(ProfilesVerifyFailed);
    expect(results[1]).instanceOf(ProfileTokenVerifyFailed);
  });

  test<VerifyProfileTestContext>("Ad Profile Pair", async ({
    op,
    dp,
    opToken,
    dpToken,
    registryKeys,
  }) => {
    const verifier = ProfilesVerifier(
      {
        profile: [],
        ad: [
          {
            op: {
              iss: op.iss,
              sub: op.sub,
              profile: opToken,
            },
            dp: {
              sub: dp.subject,
              profile: dpToken,
            },
          },
        ],
      },
      registryKeys,
      op.iss,
      null,
      origin,
    );
    const verified = await verifier();
    expect(verified[0]).toMatchObject({
      op: { ...expected.op, jwks: op.jwks },
    });
    expect(verified[1]).toMatchObject({ dp });
  });
});
