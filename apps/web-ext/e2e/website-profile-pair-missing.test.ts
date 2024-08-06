import { expect, popup, test } from "./fixtures";
import { BrowserContext, Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

let ext: Page | undefined;

type Response = {
  status: number;
  contentType: string;
  body: string;
};

const profileSetEndpoint =
  "/website/ef9d78e0-d81a-4e39-b7a0-27e15405edc7/profiles";

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
          href="${profileSetEndpoint}"
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

// Unsupportedの文言を確認する関数
async function checkUnsupportedMessages() {
  const message1 =
    "組織の信頼性情報と出版物の流通経路が正しく読み取れませんでした";
  const count1 = await ext?.locator(`:text("${message1}")`).count();
  expect(count1).toEqual(1);

  const message2 = "組織の信頼性情報と出版物の流通経路がまだありません";
  const count2 = await ext?.locator(`:text("${message2}")`).count();
  expect(count2).toEqual(1);

  const message3 = "組織の信頼性情報と出版物の流通経路の取得に失敗しました";
  const count3 = await ext?.locator(`:text("${message3}")`).count();
  expect(count3).toEqual(1);
}

// サイトプロファイルのみ表示の文言を確認する
async function checkSiteProfileWithoutOtherProfiles() {
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

  // website.titleの存在を確認
  expect(
    await ext?.locator('h1:has-text("Website Profile Pair title")').count(),
  ).toEqual(1);

  expect(await ext?.locator("main").count()).toEqual(0);
}

async function runTest(
  ctx: BrowserContext,
  page: Page,
  url: string,
  noProfilePair: boolean,
  noProfileSet: boolean,
) {
  await page.route("**", (route) => {
    const url = new URL(route.request().url());

    // .well-known/pp.jsonの取得が必ず実行されるのでnoProfilePair=trueで拒否
    if (url.pathname === "/.well-known/pp.json" && noProfilePair) {
      return route.abort();
    }

    // Profile Set エンドポイントへのリクエストを拒否で取得失敗を再現
    if (url.pathname === profileSetEndpoint && noProfileSet) {
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
    false,
  );

  await checkSiteProfileWithoutOtherProfiles();
});

test("pp.json取得失敗(エンドポイントなし)の確認", async ({ context, page }) => {
  const noProfilePair = true;
  await runTest(
    context,
    page,
    "http://localhost:8080/app/debugger",
    noProfilePair,
    false,
  );

  await checkUnsupportedMessages();
});

test("ps.jsonの取得失敗、pp.json取得失敗(エンドポイントあり)の確認", async ({
  context,
  page,
}) => {
  const noProfilePair = true;
  const noProfileSet = true;
  await runTest(
    context,
    page,
    "http://localhost:8080/test",
    noProfilePair,
    noProfileSet,
  );

  await checkUnsupportedMessages();
});

test("ps.jsonの取得失敗、pp.json取得成功(エンドポイントあり)の確認", async ({
  context,
  page,
}) => {
  const noProfilePair = false;
  const noProfileSet = true;
  await runTest(
    context,
    page,
    "http://localhost:8080/test",
    noProfilePair,
    noProfileSet,
  );

  await checkUnsupportedMessages();
});
