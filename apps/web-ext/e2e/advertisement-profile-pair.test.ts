import type { Page } from "@playwright/test";
import { popup, test } from "./fixtures";

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
