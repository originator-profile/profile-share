import { expect, popup, test as base } from "./fixtures";

const credentialsMissingHtml = `
<!doctype html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>OPSとCASが未設置</title>
</head>
<body>
  <p id="text-target-integrity">OPSとCASが未設置でSiteProfileの取得に失敗するテスト</p>
</body>
</html>`;

const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      "http://localhost:8080/.well-known/sp.json",
      async (route) =>
        route.fulfill({
          status: 404,
        }),
    );

    await page.route(
      "http://localhost:8080/examples/credentials-not-exists.html",
      async (route) =>
        route.fulfill({
          body: credentialsMissingHtml,
          contentType: "text/html",
        }),
    );

    await use(page);
  },
});

test("OPS / CAS 未設置かつSiteProfileの取得の失敗した場合非サポートが表示されるか", async ({
  context,
  page,
}) => {
  await page.goto("http://localhost:8080/examples/credentials-missing.html");
  const ext = await popup(context);
  await expect(ext.getByTestId("p-elm-unsupported-message")).toBeVisible();
  await expect(
    ext.getByText(
      "組織の信頼性情報と出版物の流通経路が\n正しく読み取れませんでした",
    ),
  ).toHaveCount(1);
});
