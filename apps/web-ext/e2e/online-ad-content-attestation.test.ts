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

test("OnlineAd Content Attestation の表示が正しく行われていることを確認", async ({
  context,
  page,
  validOps,
  validCas,
  onlineAdPage,
}) => {
  await validOps({ publicKey, privateKey }, onlineAdPage.issuer);

  // OnlineAd Content Attestationを署名
  await validCas(
    { privateKey },
    onlineAdPage.contents,
    onlineAdPage.issuer,
    "OnlineAd",
  );

  // ページに遷移
  await page.goto(onlineAdPage.endpoint);
  const ext = await popup(context);

  // 拡張機能の表示が正しいことを確認
  await expect(ext.getByTestId("cas")).toBeVisible();
  await expect(
    ext.getByRole("paragraph").getByText("テスト広告タイトル"),
  ).toBeVisible();
  await expect(
    ext.getByText("テスト広告の説明文").filter({ visible: true }),
  ).toBeVisible();

  // オーバーレイ表示の確認
  const highlightFrame = page.frameLocator("iframe");
  expect(await highlightFrame.getByTestId("content-highlight").count()).toEqual(
    1,
  );
});
