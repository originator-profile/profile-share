import { describe, afterEach, expect, test, afterAll } from "vitest";
import { Page } from "playwright";
import { ctx, popup } from "./setup";

describe("ProfileSet不在/不正時の確認", () => {
  let ext: Page | undefined;
  let page: Page | undefined;

  type Response = {
    status: number;
    contentType: string;
    body: string;
  };

  const responseMap: Record<string, Response> = {
    "/test": {
      status: 200,
      contentType: "text/html",
      body: `
        <!doctype html>
        <html lang="ja">
        <head>
          <meta charset="utf-8">
          <title>Title</title>
          <link
            href="/ps.json"
            rel="alternate"
            type="application/ld+json"
          />
        </head>
        <body><h1>ProfileSet不在時(エンドポイントあり、取得できない)の確認</h1></body>
        </html>
      `,
    },
    "/": {
      status: 200,
      contentType: "text/html",
      body: `
        <!doctype html>
        <html lang="ja">
        <head>
          <meta charset="utf-8">
          <title>Title</title>
        </head>
        <body>
          <h1>ProfileSet不在時(エンドポイントなし)の確認</h1>
        </body>
        </html>
      `,
    },
  };

  async function runTest(url: string): Promise<Page> {
    page = await ctx.newPage();
  
    await page.route("**", (route) => {
      const url = new URL(route.request().url());
  
      if(url.pathname === "/ps.json") {
        return route.abort();
      }
  
      const response = responseMap[url.pathname];
  
      if (response) {
        return route.fulfill(response);
      } else {
        return route.continue();
      }
    });
  
    try{
      await page.goto(url);
    } catch (err) {
      console.error(`Error navigating to ${url}`);
    }
    ext = await popup(ctx);
  
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
  
    return page;
  }

  afterEach(async ({ task }) => {
    await page?.screenshot({ path: `screenshots/${task.name}-webpage.png` });
    await ext?.screenshot({ path: `screenshots/${task.name}-web-ext.png` });
  });

  afterAll(async () => {
    await Promise.all(ctx.pages().map((page) => page.close()));
  });

  test("ProfileSet不在時(エンドポイントなし)の確認", async () => {
    await runTest("http://localhost:8080/");
    await expect(ext?.locator("details dd").textContent()).resolves.toBe("No profile sets found");
  });

  test("ProfileSet不在時(エンドポイントあり、取得できない)の確認", async () => {
    await runTest("http://localhost:8080/test");
    await expect(ext?.locator("details dd").textContent()).resolves.toBe("プロファイルを取得できませんでした:\nFailed to fetch");
  });

});
