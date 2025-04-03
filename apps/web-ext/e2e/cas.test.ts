import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import { mergeTests } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const test = mergeTests(
  base,
  siteProfileTest,
  staticHtmlTest,
  credentialsTest,
).extend({});

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

test("Content Attestation Set の表示が正常に行えたか", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  credentialsPage,
  validCredentials,
}) => {
  await validCredentials({ publicKey, privateKey }, credentialsPage.contents);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("cas")).toBeVisible();
});
