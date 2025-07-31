import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import privateKey from "./account-key.example.priv.json" assert { type: "json" };
import publicKey from "./account-key.example.pub.json" assert { type: "json" };
import { mergeTests } from "@playwright/test";

const test = mergeTests(base, siteProfileTest, staticHtmlTest).extend({});

test("Site Profile を取得検証できる", async ({
  context,
  page,
  validSiteProfile,
  credentialsMissingPage,
}) => {
  await validSiteProfile(
    { privateKey, publicKey },
    credentialsMissingPage.issuer,
  );
  await page.goto(credentialsMissingPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("site-profile")).toBeVisible();
  expect(await ext?.getByTestId("site-profile-wsp-name").innerText()).toBe(
    "SiteProfileの取得検証",
  );
});
