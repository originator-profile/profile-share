import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });
let ext: Page | undefined;

test.beforeEach(async ({ context, page }) => {
  // Profile Registry にアクセス (apps/registry)
  await page.goto("http://localhost:8080/examples/ad.html");

  ext = await popup(context);

  // 3つ目のピンがウィンドウ外に表示されてしまうのでウィンドウのサイズ変更
  await page.setViewportSize({ width: 1920, height: 1080 });
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-本体.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-拡張機能.png` });
});

test("広告プロファイルにおける表示の確認", async ({ page }) => {
  //対象のWebページにオーバーレイ表示が読み込まれるまで待機(iframeが複数あるのでsrcdoc指定)
  await page.waitForSelector("iframe[srcdoc]");

  expect(
    await ext
      ?.locator(':text("この広告の発行者には信頼性情報があります")')
      .count(),
  ).toEqual(1);

  expect(await ext?.title()).toMatch(/コンテンツ情報/);

  expect(
    await ext
      ?.locator(':text("このサイトの運営者には信頼性情報があります")')
      .count(),
  ).toEqual(1);

  //オーバーレイ表示の確認
  const overlayFrame = page.frameLocator("iframe[srcdoc]");

  expect(await page.title()).toMatch(/広告のデモ/);

  // 確認前に要素読み込みまで待機
  await overlayFrame
    .locator(
      'button[title*="Originator Profile 技術研究組合 (開発用) iframe 1"]',
    )
    .waitFor();
  await overlayFrame
    .locator(
      'button[title*="Originator Profile 技術研究組合 (開発用) iframe 2"]',
    )
    .waitFor();
  await overlayFrame
    .locator(
      'button[title*="Originator Profile 技術研究組合 (開発用) iframe 3"]',
    )
    .waitFor();

  expect(
    await overlayFrame
      .getByRole("button", {
        name: "Originator Profile 技術研究組合 (開発用) iframe 1",
      })
      .count(),
    "ピンが1つ存在する",
  ).toEqual(1);

  expect(
    await overlayFrame
      .getByRole("button", {
        name: "Originator Profile 技術研究組合 (開発用) iframe 2",
      })
      .count(),
    "ピンが1つ存在する",
  ).toEqual(1);

  expect(
    await overlayFrame
      .getByRole("button", {
        name: "Originator Profile 技術研究組合 (開発用) iframe 3",
      })
      .count(),
    "ピンが1つ存在する",
  ).toEqual(1);
});
