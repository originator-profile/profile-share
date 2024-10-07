import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });
let ext: Page | undefined;

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-本体.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-拡張機能.png` });
});

test.skip("サイトプロファイルにおける表示の確認", async ({ context, page }) => {
  // Profile Registry にアクセス (apps/registry)
  await page.goto("http://localhost:8080/examples/many-dps.html");

  ext = await popup(context);
  expect(await ext?.title()).toMatch(/コンテンツ情報/);

  // サイトプロファイルの発行者を持つ要素が存在するか確認
  expect(await ext?.getByTestId("pp-json-holder").innerText()).toMatch(
    /Originator Profile 技術研究組合/,
  );

  expect(
    await ext
      ?.locator(':text("このサイトの運営者には信頼性情報があります")')
      .count(),
  ).toEqual(1);

  // 対象のWebページにオーバーレイ表示が読み込まれるまで待機
  await page.waitForSelector("iframe");

  // 対象Webページにのタイトル確認
  expect(await page.title()).toMatch("複数の DP (Demo)");

  // website.titleの存在を確認
  expect(
    await ext?.locator('h1:has-text("Website Profile Pair title")').count(),
  ).toEqual(1);
});

test.skip("サイトプロファイルのみ表示の確認", async ({ context, page }) => {
  // 存在しないページにアクセス
  await page.goto("http://localhost:8080/examples/404.html");

  ext = await popup(context);
  expect(await ext?.title()).toMatch(/コンテンツ情報/);

  // サイトプロファイルの発行者を持つ要素が存在するか確認
  expect(await ext?.getByTestId("pp-json-holder").innerText()).toMatch(
    /Originator Profile 技術研究組合/,
  );

  expect(
    await ext
      ?.locator(':text("このサイトの運営者には信頼性情報があります")')
      .count(),
  ).toEqual(1);

  expect(
    await ext?.locator(':text("の発行者には信頼性情報があります")').count(),
  ).toEqual(0);
});
