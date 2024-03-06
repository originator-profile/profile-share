import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });
let ext: Page;

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
  await expect(ext?.locator("main")).toBeVisible();
  await expect(ext?.locator("main")).toContainText(
    "この広告の発行者には信頼性情報があります",
  );

  // 拡張機能のdpアイテムの個数取得
  const dpLinksCount = await ext?.locator("nav").getByRole("link").count();

  //オーバーレイ表示の確認
  //対象のWebページにオーバーレイ表示が読み込まれるまで待機(iframeが複数あるのでsrcdoc指定)
  await page.waitForSelector("iframe[srcdoc]");
  const overlayFrame = page.frameLocator("iframe[srcdoc]");

  // 可視性の確認
  await expect(overlayFrame.getByRole("button").first()).toBeVisible();
  // 個数確認(ユーザーから見える状態かは確認しない)
  await expect(overlayFrame.getByRole("button")).toHaveCount(dpLinksCount);
});
