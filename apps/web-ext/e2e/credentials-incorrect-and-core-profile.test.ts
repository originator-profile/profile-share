import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { mergeTests } from "@playwright/test";
import { generateKey } from "@originator-profile/cryptography";

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

test("CAS(検証失敗)とCP(検証成功)の組み合わせの検証テスト", async ({
  context,
  page,
  signMultipleKeysForCredentials,
  credentialsPage,
}) => {
  const correct = await generateKey();
  const incorrect = await generateKey();
  const cpSignKey = privateKey;
  const cpJwks = correct.publicKey;
  const caSignKey = incorrect.privateKey;
  await signMultipleKeysForCredentials(
    { cpSignKey, cpJwks, caSignKey },
    credentialsPage.contents,
  );
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
