import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import { createThumbprint } from "@originator-profile/sign";

test("プラグインをアクチベーション後プライベート鍵が存在する", async () => {
  const keyFilePath = path.join(
    __dirname,
    "../tmp/profile-test-snapshots/profile.key.pem",
  );
  const stats = await fs.stat(keyFilePath);
  expect(stats.isFile()).toBe(true);
});

test("kidがprofile-sign:createThumbprint()で得られる値と一致することを検証", async () => {
  const jwkFilePath = path.join(__dirname, "../tests/snapshots/jwk.json");
  const jwkFile = await fs.readFile(jwkFilePath);
  const jwk = JSON.parse(jwkFile.toString());
  const thumbprint = await createThumbprint(jwk, "ES256");
  expect(jwk.kid).toBe(thumbprint);
});
