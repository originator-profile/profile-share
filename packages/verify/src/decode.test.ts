import { test, expect } from "vitest";
import { TokenDecoder } from "./decode";
import { ProfileClaimsValidationFailed } from "./errors";

test("無効な形式のJWTのときデコードに失敗", () => {
  const invalidToken = "invalid.jwt";
  const decoder = TokenDecoder(null);
  const decoded = decoder(invalidToken);
  expect(decoded).instanceOf(ProfileClaimsValidationFailed);
});
