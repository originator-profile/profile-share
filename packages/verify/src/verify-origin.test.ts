import { describe, test, expect } from "vitest";
import { addYears, getUnixTime } from "date-fns";
import { JwtDpPayload } from "@originator-profile/model";
import { verifyOrigin } from "./verify-origin";

describe("verify-origin", () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const origin = "https://example.com";

  test("allowedOrgins プロパティ未指定ならばすべてのオリジンを許可", () => {
    const payload: JwtDpPayload = {
      iat,
      exp,
      iss: "example.com",
      sub: "https://example.com/article/42",
      "https://originator-profile.org/dp": {
        item: [],
      },
    };
    const result = verifyOrigin(origin, payload);
    expect(result).toBe(true);
  });

  test("利用可能なオリジンに `*` が含まれるならばすべてのオリジンを許可", () => {
    const payload: JwtDpPayload = {
      iat,
      exp,
      iss: "example.com",
      sub: "https://example.com/article/42",
      "https://originator-profile.org/dp": {
        item: [],
        allowedOrigins: ["*"],
      },
    };
    const result = verifyOrigin(origin, payload);
    expect(result).toBe(true);
  });

  test("利用可能なオリジンに対象のオリジンが含まれるならば許可", () => {
    const payload: JwtDpPayload = {
      iat,
      exp,
      iss: "example.com",
      sub: "https://example.com/article/42",
      "https://originator-profile.org/dp": {
        item: [],
        allowedOrigins: ["https://example.com"],
      },
    };
    const result = verifyOrigin(origin, payload);
    expect(result).toBe(true);
  });

  test("利用可能なオリジンに対象のオリジンが含まれないならば拒否", () => {
    const payload: JwtDpPayload = {
      iat,
      exp,
      iss: "example.com",
      sub: "https://example.com/article/42",
      "https://originator-profile.org/dp": {
        item: [],
        allowedOrigins: ["http://example.com"],
      },
    };
    const evilOrigin = "https://evil.example.com";
    const result = verifyOrigin(evilOrigin, payload);
    expect(result).toBe(false);
  });
});
