import { mergeTests } from "@playwright/test";
import { expect, popup, test as base } from "../fixtures";
import { test as siteProfileTest } from "../site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";

const test = mergeTests(base, siteProfileTest, staticHtmlTest).extend({});

test("Display unsupported message when OPS/CAS are missing and SiteProfile fetch fails", async ({
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
      "The organization's credibility information and publication's distribution path could not be read correctly",
    ),
  ).toHaveCount(1);
});
