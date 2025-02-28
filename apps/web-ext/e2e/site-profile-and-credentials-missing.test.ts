import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as crednetialsTest } from "./credentials-fixtures";
import { mergeTests } from "@playwright/test";

const test = mergeTests(base, siteProfileTest, staticHtmlTest, crednetialsTest);
test("Site Profile と OPS/CAS が取得できない場合非サポートが表示されるか", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  missingCredentials: _missingCredentials,
  credentialsPage,
}) => {
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-unsupported-message")).toBeVisible();
  await expect(
    ext.getByText(
      "組織の信頼性情報と出版物の流通経路が\n正しく読み取れませんでした",
    ),
  ).toHaveCount(1);
});
