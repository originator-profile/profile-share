import { describe, beforeEach, afterEach, expect, test } from "vitest";
import { Page } from "playwright";
import { ctx, popup } from "./setup";

describe("launch", () => {
  let page: Page | undefined;

  beforeEach(async () => {
    page = await ctx.newPage();
  });

  afterEach(async ({ meta }) => {
    await page?.screenshot({ path: `screenshots/${meta.name}.png` });
    await Promise.all(ctx.pages().map((page) => page.close()));
  });

  test("拡張機能を起動して一覧画面を表示", async () => {
    // Profile Registry にアクセス (apps/registry)
    await page?.goto("http://localhost:8080/");
    page = await popup(ctx);
    expect(await page.title()).toBe("Profile Web Extension");
    // 会員のロゴ画像の例 (apps/registry/account.example.json)
    await page.waitForSelector("img[src$='-webdino.jpg']");
  });
});
