import { describe, beforeEach, afterEach, expect, test } from "vitest";
import { Page } from "playwright";
import { ctx, popup } from "./setup";

describe("ProfileSet不在/不正時の確認", () => {
  let page: Page | undefined;
  let ext: Page | undefined;

  beforeEach(async () => {
    page = await ctx.newPage();
    await page.goto("https://www.google.com/");
    ext = await popup(ctx);
  });

  afterEach(async () => {
    await Promise.all(ctx.pages().map((page) => page.close()));
  });

  test("ProfileSet不在時の確認", async () => {
    const messages = [
      "組織の信頼性情報と出版物の流通経路が正しく読み取れませんでした",
      "組織の信頼性情報と出版物の流通経路がまだありません",
      "組織の信頼性情報と出版物の流通経路の取得に失敗しました",
    ];

    const counts = await Promise.all(
      messages.map((message) => ext?.locator(`:text("${message}")`).count()),
    );

    counts.forEach((count) => {
      expect(count).toEqual(1);
    });
  });
});
