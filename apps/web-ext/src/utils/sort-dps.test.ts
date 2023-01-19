import { test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Dp } from "../types/profile";
import sortDps from "./sort-dps";

const iat = getUnixTime(new Date());
const exp = getUnixTime(addYears(new Date(), 10));
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
const dps: Dp[] = [anotherDp, dp];

test("sortDps() sorts main to head if main exists", async () => {
  const sorted = sortDps(dps, [dp.subject]);
  expect(sorted).toMatchObject([dp, anotherDp]);
});

test("sortDps() returns empty array if niether main and profile exists", async () => {
  const sorted = sortDps([], []);
  expect(sorted).toMatchObject([]);
});
