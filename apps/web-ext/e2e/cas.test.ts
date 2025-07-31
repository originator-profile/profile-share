import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import { mergeTests } from "@playwright/test";
import privateKey from "./account-key.example.priv.json" assert { type: "json" };
import publicKey from "./account-key.example.pub.json" assert { type: "json" };

const test = mergeTests(
  base,
  siteProfileTest,
  staticHtmlTest,
  credentialsTest,
).extend({});

test("Content Attestation Set の表示が正常に行えたか", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  credentialsPage,
  validCredentials,
}) => {
  await validCredentials(
    { publicKey, privateKey },
    credentialsPage.contents,
    credentialsPage.issuer,
  );
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("cas")).toBeVisible();
});
