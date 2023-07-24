import { describe, beforeEach, afterEach, expect, test } from "vitest";
import { Page } from "playwright";
import { ctx, popup } from "./setup";

describe("ProfileSet不在/不正時の確認", () => {
  let page: Page | undefined;
  let ext: Page | undefined;

  type Response = {
    status: number;
    contentType: string;
    body: string;
  };

  const responseMap: Record<string, Response> = {
    "/": {
      status: 200,
      contentType: "text/html",
      body: '<!doctype html><html lang="ja"><head><title>Test page</title></head><body><h1>Test page</h1></body></html>',
    },
  };

  beforeEach(async () => {
    page = await ctx.newPage();
    await page.route("**", (route) => {
      const url = new URL(route.request().url());
      const response = responseMap[url.pathname];

      if (response) {
        return route.fulfill(response);
      } else {
        return route.continue();
      }
    });

    await page.goto("http://localhost:8080/");
    ext = await popup(ctx);
  });

  afterEach(async ({ task }) => {
    await page?.screenshot({ path: `screenshots/${task.name}-webpage.png` });
    await ext?.screenshot({ path: `screenshots/${task.name}-web-ext.png` });
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
