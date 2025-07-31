import { generateKey } from "@originator-profile/cryptography";
import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import privateKey from "./account-key.example.priv.json" assert { type: "json" };
import publicKey from "./account-key.example.pub.json" assert { type: "json" };
import { mergeTests } from "@playwright/test";

const test = mergeTests(
  base,
  siteProfileTest,
  staticHtmlTest,
  credentialsTest,
).extend({});

test("異なる鍵ペアによる署名のとき検証失敗", async ({
  context,
  page,
  validSiteProfile,
  credentialsPage,
  validCredentials,
}) => {
  await validSiteProfile({ privateKey, publicKey }, credentialsPage.issuer);
  const key = await generateKey();
  await validCredentials(key, credentialsPage.contents, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);

  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
