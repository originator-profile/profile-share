import { test, expect, describe } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Dp } from "../types/profile";
import { DocumentProfile } from "./profile";
import { ProfileSet } from "./profile-set";

const iat = getUnixTime(new Date());
const exp = getUnixTime(addYears(new Date(), 10));
const dp: Dp = {
  type: "dp",
  issuedAt: fromUnixTime(iat).toISOString(),
  expiredAt: fromUnixTime(exp).toISOString(),
  issuer: "example.com",
  subject: "https://example.com/article/42",
  item: [],
};
const anotherDp: Dp = {
  type: "dp",
  issuedAt: fromUnixTime(iat).toISOString(),
  expiredAt: fromUnixTime(exp).toISOString(),
  issuer: "example.com",
  subject: "https://example.com/article/43",
  item: [],
};

describe("ProfileSet class", () => {
  test("DPs are sorted", () => {
    const dps: DocumentProfile[] = [anotherDp, dp].map(
      (p) => new DocumentProfile(dp, dp.subject === p.subject),
    );
    const profileSet = new ProfileSet(dps);
    const sorted = profileSet.dps;
    expect(sorted.length).toBe(2);
    expect(sorted[0].isMain).toBeTruthy();
    expect(sorted[1].isMain).toBeFalsy();
  });

  test("new ProfileSet([]) returns empty ProfileSet instance", () => {
    const profileSet = new ProfileSet([]);
    expect(profileSet.isEmpty()).toBeTruthy();
    expect(profileSet.hasWebsiteProfiles()).toBeFalsy();
    expect(profileSet.dps).toMatchObject([]);
    expect(profileSet.ops).toMatchObject([]);
    expect(profileSet.serialize()).toMatchObject({
      profiles: [],
      websiteProfiles: [],
    });
  });

  test("EMPTY_PROFILE_SET", () => {
    expect(ProfileSet.EMPTY_PROFILE_SET.isEmpty()).toBeTruthy();
    expect(ProfileSet.EMPTY_PROFILE_SET.isLoading).toBeTruthy();
    expect(ProfileSet.EMPTY_PROFILE_SET.hasWebsiteProfiles()).toBeFalsy();
    expect(ProfileSet.EMPTY_PROFILE_SET.dps).toMatchObject([]);
    expect(ProfileSet.EMPTY_PROFILE_SET.ops).toMatchObject([]);
    expect(ProfileSet.EMPTY_PROFILE_SET.serialize()).toMatchObject({
      profiles: [],
      websiteProfiles: [],
    });
  });
});
