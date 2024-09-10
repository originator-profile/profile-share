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
  "/app/debugger": {
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

async function runTest(
  ctx: BrowserContext,
  page: Page,
  url: string,
  noEndpoint: boolean,
) {
  await page.route("**", (route) => {
    const url = new URL(route.request().url());

    //プロファイルの取得失敗を再現のため
    if (url.pathname === "/ps.json" && !noEndpoint) {
      return route.abort();
    }

    //エンドポイントなし時、.well-known/pp.jsonの取得が必ず実行されるので拒否
    if (url.pathname === "/.well-known/pp.json" && noEndpoint) {
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
    "組織の信頼性情報と出版物の流通経路が 正しく読み取れませんでした",
    "組織の信頼性情報と出版物の流通経路がまだありません",
    "組織の信頼性情報と出版物の流通経路の取得に失敗しました",
  ];

  const counts = await Promise.all(
    messages.map((message) => ext?.locator(`:text("${message}")`).count()),
  );

  counts.forEach((count) => {
    expect(count).toEqual(1);
  });

  const details = ["メッセージ"];

  await Promise.all(
    details.map(
      (detail) => ext && expect(ext.locator(`:text("${detail}")`)).toBeHidden(),
    ),
  );

  await ext?.locator("details>summary").click();

  await Promise.all(
    details.map(
      (detail) =>
        ext && expect(ext.locator(`:text("${detail}")`)).toBeVisible(),
    ),
  );
}

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-webpage.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-web-ext.png` });
});

test("ProfileSet不在時(エンドポイントなし)の確認", async ({
  context,
  page,
}) => {
  const noEndpoint = true;
  await runTest(
    context,
    page,
    "http://localhost:8080/app/debugger",
    noEndpoint,
  );
  await expect(ext?.locator("details dd").textContent()).resolves.toBe(
    "プロファイルが見つかりませんでした",
  );
});

test("ProfileSet不在時(エンドポイントあり、取得できない)の確認", async ({
  context,
  page,
}) => {
  const noEndpoint = false;
  await runTest(context, page, "http://localhost:8080/test", noEndpoint);
  await expect(ext?.locator("details dd").textContent()).resolves.toBe(
    "プロファイルを取得できませんでした:\nFailed to fetch",
  );
});
