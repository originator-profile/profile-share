import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });
let ext: Page | undefined;

test.beforeEach(async ({ context, page }) => {
  // Profile Registry にアクセス (apps/registry)
  await page.goto("http://localhost:8080/app/debugger");

  ext = await popup(context);
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-本体.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-拡張機能.png` });
});

test("サイトプロファイルにおける表示の確認", async ({ page }) => {
  // 拡張機能ウィンドウの状態を確認
  expect(await ext?.title()).toMatch(/コンテンツ情報/);
  expect(
    await ext?.locator(':text("Originator Profile 技術研究組合")').count(),
  ).toEqual(2);
  expect(
    await ext
      ?.locator(':text("このサイトの運営者には信頼性情報があります")')
      .count(),
  ).toEqual(1);

  // 対象のWebページにオーバーレイ表示が読み込まれるまで待機
  await page.waitForSelector("iframe");

  // 対象Webページにマークは表示されているか
  expect(await page.title()).toMatch(/OP登録サイト/);

  // website.titleの存在を確認
  expect(
    await ext?.locator('h1:has-text("Website Profile Pair title")').count(),
  ).toEqual(1);

  // website.descriptionの存在を確認
  expect(
    await ext?.locator(':text("Website Profile Pair description")').count(),
  ).toEqual(1);
});
