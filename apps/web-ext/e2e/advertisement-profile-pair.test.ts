import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });
let ext: Page | undefined;

test.beforeEach(async ({ context, page }) => {
  // Profile Registry にアクセス (apps/registry)
  await page.goto("http://localhost:8080/examples/many-dps.html");

  ext = await popup(context);
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-本体.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-拡張機能.png` });
});

test("広告プロファイルにおける表示の確認", async () => {

    // 広告に移動
    await ext?.click(
    'a[href*="/publ/localhost/"][href*="/6a65e608-6b3e-4184-9fd2-0aafd1ddd38e"]',
    );

    expect(await ext?.locator(':text("この広告の発行者には信頼性情報があります")').count()).toEqual(1);

    expect(await ext?.getByTestId("advertisement-type").innerText()).toMatch(
      /この広告の発行者には信頼性情報があります/,
      );

    expect(await ext?.title()).toMatch(/コンテンツ情報/);

    expect(
    await ext
        ?.locator(':text("このサイトの運営者には信頼性情報があります")')
        .count(),
    ).toEqual(1);
});
