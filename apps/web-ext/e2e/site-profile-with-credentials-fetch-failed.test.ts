import { expect, popup, test as base } from "./fixtures";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { mergeTests } from "@playwright/test";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as crednetialsTest } from "./credentials-fixtures";

const cwd = path.dirname(fileURLToPath(new URL(import.meta.url)));
const privKeyPath = path.join(
  cwd,
  "../../registry/account-key.example.priv.json",
);
const privKeyBuffer = await fs.readFile(privKeyPath);
const privateKey = JSON.parse(privKeyBuffer.toString());

const pubKeyPath = path.join(
  cwd,
  "../../registry/account-key.example.pub.json",
);
const pubKeyBuffer = await fs.readFile(pubKeyPath);
const publicKey = JSON.parse(pubKeyBuffer.toString());

const test = mergeTests(base, siteProfileTest, crednetialsTest, staticHtmlTest);
test("SiteProfileは検証成功するが、OPS / CASの取得に失敗した時にSiteProfileの表示がされるか", async ({
  context,
  page,
  validSiteProfile,
  missingCredentials: _missingCredentials,
  credentialsPage,
}) => {
  await validSiteProfile({ publicKey, privateKey });
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext.getByTestId("site-profile")).toBeVisible();
  expect(await ext.getByTestId("site-profile-wsp-name").innerText()).toBe(
    "SiteProfileの取得検証",
  );

  await expect(ext.locator("main")).toHaveCount(0);
});
