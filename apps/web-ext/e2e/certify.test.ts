import { describe, beforeEach, afterEach, expect, test } from "vitest";
import { Page } from "playwright";
import { ctx, popup } from "./setup";

describe("certify", () => {
  let page: Page | undefined;
  let ext: Page | undefined;

  beforeEach(async () => {
    page = await ctx.newPage();
    // Profile Registry にアクセス (apps/registry)
    await page.goto("http://localhost:8080/");
    ext = await popup(ctx);
  });

  afterEach(async ({ task }) => {
    await page?.screenshot({ path: `screenshots/${task.name}-本体.png` });
    await ext?.screenshot({ path: `screenshots/${task.name}-拡張機能.png` });
    await Promise.all(ctx.pages().map((page) => page.close()));
  });

  test("拡張機能画面での認証および対象ページのマークを確認", async () => {
    // 拡張機能ウィンドウの状態
    expect(await ext?.title()).toMatch(/コンテンツ情報/);
    expect(
      await ext?.locator(':text("この記事を発行した組織") + p').textContent(),
    ).toMatch("Originator Profile 技術研究組合");
    expect(
      await ext?.locator(':text("この組織は認証を受けています")').count(),
    ).toEqual(1);
    expect(
      await ext
        ?.locator('span:has-text("ブランドセーフティ認証")')
        .textContent(),
    ).toMatch(/自己検証/);
    expect(
      await ext
        ?.locator('p:has-text("ブランドセーフティ認証") + p')
        .textContent(),
    ).toMatch("有効期限内");

    // 対象のWebページにオーバーレイ表示が読み込まれるまで待機
    await page?.waitForSelector("iframe");

    // 対象Webページにマークは表示されているか
    expect(await page?.title()).toMatch(/OP 確認くん/);
    expect(
      await page
        ?.frameLocator("iframe")
        .getByRole("button", {
          name: "Originator Profile 技術研究組合 OP 確認くん OP 確認くん",
        })
        .count(),
      "ピンが少なくとも1つ存在する",
    ).toBeGreaterThanOrEqual(1);
  });
});
