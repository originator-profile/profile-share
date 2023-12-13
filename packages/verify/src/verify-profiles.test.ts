import { describe, test, expect } from "vitest";
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

describe("verify-profiles", async () => {
  const certKeys = await generateKey();
  const subKeys = await generateKey();
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const op: Op = {
    type: "op",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "example.org",
    subject: "example.com",
    item: [],
    jwks: { keys: [subKeys.publicKey] },
  };
  const dp: Dp = {
    type: "dp",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "example.com",
    subject: "https://example.com/article/42",
    item: [],
    allowedOrigins: ["https://example.com"],
  };
  const opToken = await signOp(op, certKeys.privateKey);
  const dpToken = await signDp(dp, subKeys.privateKey);
  const registryKeys = LocalKeys({ keys: [certKeys.publicKey] });
  const origin = "https://example.com";

  test("Verify Profiles", async () => {
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

  test("OPの検証に失敗すると子も検証に失敗", async () => {
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

  test("不正なitemが含まれるときClaims Setの確認に失敗 (要 SignedProfileValidator)", async () => {
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

  test("不正な公開鍵のときJWTの検証に失敗", async () => {
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

  test("重複するJWTは取り除く", async () => {
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

  test("DPの持たないOPが存在するときProfile Setの検証に失敗", async () => {
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

  test("DPの検証に失敗するとその親のOPも検証に失敗", async () => {
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

  test("Ad Profile Pair", async () => {
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
