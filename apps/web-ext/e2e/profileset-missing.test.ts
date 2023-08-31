import { expect, popup, test } from "./fixtures";
import { BrowserContext, Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

let ext: Page | undefined;

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

async function runTest(ctx: BrowserContext, page: Page, url: string) {
  await page.route("**", (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === "/ps.json") {
      return route.abort();
    }

    const response = responseMap[url.pathname];

    if (response) {
      return route.fulfill(response);
    } else {
      return route.continue();
    }
  });

  try {
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
}

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-webpage.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-web-ext.png` });
});

test("ProfileSet不在時(エンドポイントなし)の確認", async ({
  context,
  page,
}) => {
  await runTest(context, page, "http://localhost:8080/");
  await expect(ext?.locator("details dd").textContent()).resolves.toBe(
    "No profile sets found",
  );
});

test("ProfileSet不在時(エンドポイントあり、取得できない)の確認", async ({
  context,
  page,
}) => {
  await runTest(context, page, "http://localhost:8080/test");
  await expect(ext?.locator("details dd").textContent()).resolves.toBe(
    "プロファイルを取得できませんでした:\nFailed to fetch",
  );
});
