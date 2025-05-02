import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { mergeTests } from "@playwright/test";

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
test("Site Profile と CAS が取得できない場合Unsuportedが表示されるか", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  missingCas: _missingCas,
  validOps,
  credentialsPage,
}) => {
  await validOps({ publicKey, privateKey });
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-unsupported-message")).toBeVisible();
  await expect(
    ext.getByText(
      "組織の信頼性情報と出版物の流通経路が\n正しく読み取れませんでした",
    ),
  ).toHaveCount(1);
});
