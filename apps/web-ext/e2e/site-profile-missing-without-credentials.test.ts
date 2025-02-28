import { mergeTests } from "@playwright/test";
import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";

const test = mergeTests(base, siteProfileTest, staticHtmlTest).extend({});

test("OPS / CAS 未設置かつSiteProfileの取得の失敗した場合非サポートが表示されるか", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  credentialsMissingPage,
}) => {
  await page.goto(credentialsMissingPage.endpoint);
  const ext = await popup(context);
  await expect(ext.getByTestId("p-elm-unsupported-message")).toBeVisible();
  await expect(
    ext.getByText(
      "組織の信頼性情報と出版物の流通経路が\n正しく読み取れませんでした",
    ),
  ).toHaveCount(1);
});
