import { expect, popup, test as base } from "../fixtures";
import { test as siteProfileTest } from "../site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "../credentials-fixtures";
import { mergeTests } from "@playwright/test";
import privateKey from "../account-key.example.priv.json" with { type: "json" };
import publicKey from "../account-key.example.pub.json" with { type: "json" };

const test = mergeTests(
  base,
  siteProfileTest,
  staticHtmlTest,
  credentialsTest,
).extend({});

test("Verify OnlineAd Content Attestation is displayed correctly", async ({
  context,
  page,
  validOps,
  validCas,
  onlineAdPage,
}) => {
  await validOps({ publicKey, privateKey }, onlineAdPage.issuer);

  // Sign OnlineAd Content Attestation
  await validCas(
    { privateKey },
    onlineAdPage.contents,
    onlineAdPage.issuer,
    "OnlineAd",
  );

  // Navigate to page
  await page.goto(onlineAdPage.endpoint);
  const ext = await popup(context);

  // Verify extension display is correct
  await expect(ext.getByTestId("cas")).toBeVisible();
  await expect(
    ext.getByRole("paragraph").getByText("Test Ad Title"),
  ).toBeVisible();
  await expect(
    ext.getByText("Test ad description").filter({ visible: true }),
  ).toBeVisible();

  // Verify overlay display
  const highlightFrame = page.frameLocator("iframe");
  expect(await highlightFrame.getByTestId("content-highlight").count()).toEqual(
    1,
  );
});
