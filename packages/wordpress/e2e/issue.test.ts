import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import { SignedProfileValidator } from "@originator-profile/verify";

test("妥当なDocument Profile Itemであることを検証", async () => {
  const snapshotFilePath = path.join(
    __dirname,
    "../tests/snapshots/dp-item.json",
  );
  const snapshotFile = await fs.readFile(snapshotFilePath);
  const dpClaims = {
    iss: "example.com",
    sub: "https://example.com/article/42",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://originator-profile.org/dp": {
      item: JSON.parse(snapshotFile.toString()),
    },
  };
  const signedProfileValidator = SignedProfileValidator();
  const valid = signedProfileValidator.validateJwtDpPayload(dpClaims);
  expect(valid).toBe(true);
});
