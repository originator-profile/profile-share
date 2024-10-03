import { BrowserContext, Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";

test.describe.configure({ mode: "serial" });

let ext: Page | undefined;

type Response = {
  status: number;
  contentType: string;
  body: string;
};

const responseMap: Record<string, Response> = {
  "/invalid-ps": {
    status: 200,
    contentType: "text/html",
    body: `
      <!doctype html>
      <html lang="ja">
      <head>
        <meta charset="utf-8">
        <title>ProfileSet不正時の確認</title>
        <link
          href="/ps.json"
          rel="alternate"
          type="application/ld+json"
        />
      </head>
      <body><h1>ProfileSet不正時の確認</h1></body>
      </html>
    `,
  },
  "/ps.json": {
    status: 200,
    contentType: "application/json",
    body: `{
          "@context":{
              "op":"https://originator-profile.org/context#",
              "xsd":"http://www.w3.org/2001/XMLSchema#",
              "main":{"@id":"op:main","@type":"xsd:string"},
              "profile":{"@id":"op:profile","@type":"xsd:string"},
              "publisher":{"@id":"op:publisher","@type":"xsd:string"},
              "advertiser":{"@id":"op:advertiser","@type":"xsd:string"}
            },
            "profile":[
              "a",
              "b"
            ]
          }`,
  },
};

async function runTest(ctx: BrowserContext, page: Page, url: string) {
  await page.route("**", (route) => {
    const url = new URL(route.request().url());

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

test("ProfileSet不正時の確認", async ({ context, page }) => {
  await runTest(context, page, "http://localhost:8080/invalid-ps");
});
