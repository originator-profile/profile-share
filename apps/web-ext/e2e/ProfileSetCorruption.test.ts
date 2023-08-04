import { describe, afterEach, expect, test, afterAll } from "vitest";
import { Page } from "playwright";
import { ctx, popup } from "./setup";


describe("ProfileSet不正時の確認", () => {
  let ext: Page | undefined;
  let page: Page | undefined;

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
          <title>Title</title>
          <link
            href="/ps.json"
            rel="alternate"
            type="application/ld+json"
          />
        </head>
        <body><h1>test</h1></body>
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
            }`
      }, 
  };

  async function runTest(url: string): Promise<Page> {
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

    return page;
  }

  afterEach(async ({ task }) => {
    await page?.screenshot({ path: `screenshots/${task.name}-webpage.png` });
    await ext?.screenshot({ path: `screenshots/${task.name}-web-ext.png` });
  });

  afterAll(async () => {
    await Promise.all(ctx.pages().map((page) => page.close()));
  });

  test("ProfileSet不正時の確認", async () => {
    await runTest("http://localhost:8080/invalid-ps");
  });
  
});
