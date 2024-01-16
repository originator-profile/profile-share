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

test("拡張機能画面での認証および対象ページのマークを確認", async ({ page }) => {
  // 記事発行者の名前を持つ要素が存在するか確認
  expect(await ext?.getByTestId("ps-json-holder").innerText()).toMatch(
    /Originator Profile 技術研究組合/,
  );

  // 拡張機能ウィンドウの状態
  expect(await ext?.title()).toMatch(/コンテンツ情報/);
  expect(
    await ext
      ?.locator(':text("この記事の発行者には信頼性情報があります")')
      .count(),
  ).toEqual(1);

  // 対象のWebページにオーバーレイ表示が読み込まれるまで待機
  await page.waitForSelector("iframe");

  // 対象Webページにマークは表示されているか
  expect(await page.title()).toMatch(/OP登録サイト/);
  expect(
    await page
      .frameLocator("iframe")
      .getByRole("button", {
        name: "Originator Profile 技術研究組合 OP 確認くん",
      })
      .count(),
    "ピンが少なくとも1つ存在する",
  ).toBeGreaterThanOrEqual(1);
});
