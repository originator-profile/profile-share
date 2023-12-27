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
      <body><h1>エンドポイントあり</h1></body>
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
        <h1>エンドポイントなし</h1>
      </body>
      </html>
    `,
  },
};

async function runTest(
  ctx: BrowserContext,
  page: Page,
  url: string,
  noProfilePair: boolean,
) {
  await page.route("**", (route) => {
    const url = new URL(route.request().url());

    // エンドポイントなし時、.well-known/pp.jsonの取得が必ず実行されるので拒否
    if (url.pathname === "/.well-known/pp.json" && noProfilePair) {
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

}

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-webpage.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-web-ext.png` });
});

test("pp.json取得成功(エンドポイントなし)の確認", async ({ context, page }) => {
  const noProfilePair = false;
  await runTest(
    context,
    page,
    "http://localhost:8080/app/debugger",
    noProfilePair,
  );
  const messages = [
    "出版物の情報が",
    "見つかりませんでした",
    "ページの移動によって出版物の情報が",
    "失われた可能性があります",
  ];

  // NotFoundの文言が存在するかを確認
  const pageText01 = await ext?.locator("h1").innerText();
  const pageText02 = await ext
    ?.locator("p.text-xs.text-gray-700.mb-8")
    .innerText();

  const combinedTexts = `${pageText01}\n${pageText02}`;

  messages.forEach((message) => {
    expect(combinedTexts).toMatch(message);
  });
});

test("pp.json取得失敗(エンドポイントなし)の確認", async ({ context, page }) => {
  const noProfilePair = true;
  await runTest(
    context,
    page,
    "http://localhost:8080/app/debugger",
    noProfilePair,
  );
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

  const details = ["メッセージ"];

  await Promise.all(
    details.map(
      (detail) =>
        ext && expect(ext.locator(`:text("${detail}")`)).toBeHidden(),
    ),
  );

  await ext?.locator("details>summary").click();

  await Promise.all(
    details.map(
      (detail) =>
        ext && expect(ext.locator(`:text("${detail}")`)).toBeVisible(),
    ),
  );
  await expect(ext?.locator("details dd").textContent()).resolves.toBe(
    "No profile sets found",
  );
});
