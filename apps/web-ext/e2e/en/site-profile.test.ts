import { expect, popup, test as base } from "../fixtures";
import { test as siteProfileTest } from "../site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import privateKey from "../account-key.example.priv.json" with { type: "json" };
import publicKey from "../account-key.example.pub.json" with { type: "json" };
import { mergeTests } from "@playwright/test";

const test = mergeTests(base, siteProfileTest, staticHtmlTest).extend({});

test("Can retrieve and verify Site Profile", async ({
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
    "Site Profile Verification",
  );
});
