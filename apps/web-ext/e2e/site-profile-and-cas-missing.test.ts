// TODO:
// 名前等に違和感があるので
// https://github.com/originator-profile/profile/issues/1925
// このタスク対応でテストの見直しをしたほうが良さそう
import { expect, popup, test as base } from "./fixtures";

const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      "http://localhost:8080/.well-known/sp.json",
      async (route) =>
        route.fulfill({
          status: 404,
        }),
    );
    await use(page);
  },
});

test("Site Profile と CAS が取得できない場合", async ({ context, page }) => {
  await page.goto("http://localhost:8080/examples/cas-missing.html");
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-unsupported-message")).toBeVisible();
  await expect(
    ext.getByText(
      "組織の信頼性情報と出版物の流通経路が\n正しく読み取れませんでした",
    ),
  ).toHaveCount(1);
});
