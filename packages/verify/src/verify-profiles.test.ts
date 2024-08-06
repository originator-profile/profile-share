import { beforeEach, describe, test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Op, Dp } from "@originator-profile/model";
import { signOp, signDp, generateKey } from "@originator-profile/sign";
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
  op: Op;
  dp: Dp;
  opToken: string;
  dpToken: string;
  registryKeys: ReturnType<typeof LocalKeys>;
}

describe("verify-profiles", () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const origin = "https://example.com";

  beforeEach<VerifyProfileTestContext>(async (context) => {
    const certKeys = (context.certKeys = await generateKey());
    const subKeys = (context.subKeys = await generateKey());
    const op = (context.op = {
      type: "op",
      issuedAt: fromUnixTime(iat).toISOString(),
      expiredAt: fromUnixTime(exp).toISOString(),
      issuer: "example.org",
      subject: "example.com",
      item: [],
      jwks: { keys: [subKeys.publicKey] },
    });
    const dp = (context.dp = {
      type: "dp",
      issuedAt: fromUnixTime(iat).toISOString(),
      expiredAt: fromUnixTime(exp).toISOString(),
      issuer: "example.com",
      subject: "https://example.com/article/42",
      item: [],
      allowedOrigins: ["https://example.com"],
    });
    context.opToken = await signOp(op, certKeys.privateKey);
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
      op.issuer,
      null,
      origin,
    );
    const verified = await verifier();
    expect(verified[0]).toMatchObject({ op });
    expect(verified[1]).toMatchObject({ dp });
  });

  test<VerifyProfileTestContext>("OPの検証に失敗すると子も検証に失敗", async ({
    op,
    dpToken,
    registryKeys,
  }) => {
    const evilKeys = await generateKey();
    const evilOpToken = await signOp(op, evilKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [evilOpToken, dpToken] },
      registryKeys,
      op.issuer,
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
      issuer: "example.org",
      subject: "example.com",
      item: ["invalid"],
      jwks: { keys: [subKeys.publicKey] },
    };
    // @ts-expect-error invalid Op
    const invalidOpToken = await signOp(invalidOp, certKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [invalidOpToken] },
      registryKeys,
      op.issuer,
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
    const evilOp: Op = {
      type: "op",
      issuedAt: fromUnixTime(iat).toISOString(),
      expiredAt: fromUnixTime(exp).toISOString(),
      issuer: "example.org",
      subject: "example.com",
      item: [],
      jwks: { keys: [evilKeys.publicKey] },
    };
    const evilOpToken = await signOp(evilOp, certKeys.privateKey);
    const verifier = ProfilesVerifier(
      { profile: [evilOpToken, dpToken] },
      registryKeys,
      op.issuer,
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
      op.issuer,
      null,
      origin,
    );
    const results = await verifier();
    expect(results.length).toBe(2);
    expect(results[0]).toMatchObject({ op });
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
      op.issuer,
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
      op.issuer,
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
              iss: op.issuer,
              sub: op.subject,
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
      op.issuer,
      null,
      origin,
    );
    const verified = await verifier();
    expect(verified[0]).toMatchObject({ op });
    expect(verified[1]).toMatchObject({ dp });
  });
});
