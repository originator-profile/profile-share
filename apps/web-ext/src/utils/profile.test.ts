import { test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Op, Dp, Profile } from "../types/profile";
import { sortProfiles } from "./profile";

const iat = getUnixTime(new Date());
const exp = getUnixTime(addYears(new Date(), 10));
const op: Op = {
  type: "op",
  issuedAt: fromUnixTime(iat).toISOString(),
  expiredAt: fromUnixTime(exp).toISOString(),
  issuer: "http://localhost:8080",
  subject: "http://sub.localhost:8080",
  item: [],
  jwks: { keys: [] },
};
const dp: Dp = {
  type: "dp",
  issuedAt: fromUnixTime(iat).toISOString(),
  expiredAt: fromUnixTime(exp).toISOString(),
  issuer: "http://sub.localhost:8080",
  subject: "http://sub.localhost:8080/article/42",
  item: [],
};
const anotherDp: Dp = {
  type: "dp",
  issuedAt: fromUnixTime(iat).toISOString(),
  expiredAt: fromUnixTime(exp).toISOString(),
  issuer: "http://sub.localhost:8080",
  subject: "http://sub.localhost:8080/article/43",
  item: [],
};
const profiles: Profile[] = [anotherDp, dp, op];

test("sortProfiles() sorts main to head if main exists", async () => {
  const sorted = sortProfiles(profiles, [dp.subject]);
  expect(sorted).toMatchObject([dp, anotherDp, op]);
});

test("sortProfiles() sorts first op to head if op exists", async () => {
  const sorted = sortProfiles(profiles, []);
  expect(sorted).toMatchObject([op, anotherDp, dp]);
});

test("sortProfiles() returns empty array if niether main and profile exists", async () => {
  const sorted = sortProfiles([], []);
  expect(sorted).toMatchObject([]);
});
