import { test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Op, Dp } from "@webdino/profile-model";
import { generateKey, signOp, signDp } from "@webdino/profile-sign";
import { LocalKeys } from "./keys";
import { ProfilesVerifier } from "./verify-profiles";

test("verify Profiles", async () => {
  const issKeys = await generateKey();
  const subKeys = await generateKey();
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const op: Op = {
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "http://localhost:8080",
    subject: "http://sub.localhost:8080",
    item: [],
    jwks: { keys: [subKeys.jwk] },
  };
  const dp: Dp = {
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "http://sub.localhost:8080",
    subject: "http://sub.localhost:8080/article/42",
    item: [],
  };
  const opToken = await signOp(op, issKeys.pkcs8);
  const dpToken = await signDp(dp, subKeys.pkcs8);
  const registryKeys = LocalKeys({ keys: [issKeys.jwk] });
  const verifier = ProfilesVerifier(
    { profile: [opToken, dpToken] },
    registryKeys,
    op.issuer
  );
  const verified = await verifier();
  expect(verified[0]).toMatchObject({ op });
  expect(verified[1]).toMatchObject({ dp });
});
