import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });
let ext: Page | undefined;

test.beforeEach(async ({ context, page }) => {
  // Profile Registry にアクセス (apps/registry)
  await page.goto("http://localhost:8080/");
  ext = await popup(context);
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-本体.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-拡張機能.png` });
});

test("拡張機能画面での認証および対象ページのマークを確認", async ({ page }) => {
  // 拡張機能ウィンドウの状態
  expect(await ext?.title()).toMatch(/コンテンツ情報/);
  expect(
    await ext?.locator(':text("この記事を発行した組織") + p').textContent(),
  ).toMatch("Originator Profile 技術研究組合");
  expect(
    await ext?.locator(':text("この組織は認証を受けています")').count(),
  ).toEqual(1);
  expect(
    await ext?.locator('span:has-text("ブランドセーフティ認証")').textContent(),
  ).toMatch(/自己検証/);
  expect(
    await ext
      ?.locator('p:has-text("ブランドセーフティ認証") + p')
      .textContent(),
  ).toMatch("有効期限内");

  // 対象のWebページにオーバーレイ表示が読み込まれるまで待機
  await page.waitForSelector("iframe");

  // 対象Webページにマークは表示されているか
  expect(await page.title()).toMatch(/OP 確認くん/);
  expect(
    await page
      .frameLocator("iframe")
      .getByRole("button", {
        name: "Originator Profile 技術研究組合 OP 確認くん OP 確認くん",
      })
      .count(),
    "ピンが少なくとも1つ存在する",
  ).toBeGreaterThanOrEqual(1);
});
