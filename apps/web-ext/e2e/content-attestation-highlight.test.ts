import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import { mergeTests } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

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

test("拡張機能画面での認証および対象ページのオーバーレイ表示ができているか", async ({
  context,
  page,
  validSiteProfile,
  validCredentials,
  credentialsPage,
}) => {
  const key = { privateKey, publicKey };
  await validSiteProfile(key);
  await validCredentials(key, credentialsPage.contents);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);

  await expect(ext.getByTestId("site-profile")).toBeVisible();
  expect(
    await ext
      .getByText("このメインコンテンツの発行者には信頼性情報があります")
      .count(),
  ).toEqual(1);

  // ハイライトはiframe内に存在するためまずはiframeを取得してその中から検索する
  const highlightFrame = page.frameLocator("iframe");
  expect(await highlightFrame.getByTestId("content-highlight").count()).toEqual(
    1,
  );
});
