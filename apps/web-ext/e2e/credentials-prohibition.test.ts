import { expect, popup, test as base } from "./fixtures";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { test as credentialsTest } from "./credentials-fixtures";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { mergeTests } from "@playwright/test";

const test = mergeTests(
  base,
  siteProfileTest,
  staticHtmlTest,
  credentialsTest,
).extend({});

const cwd = path.dirname(fileURLToPath(new URL(import.meta.url)));
const privKeyPath = path.join(
  cwd,
  "../../registry/account-key.example.priv.json",
);
const privKeyBuffer = await fs.readFile(privKeyPath);
const privateKey = JSON.parse(privKeyBuffer.toString());

const pubKeyPath = path.join(
  cwd,
  "../../registry/account-key.example.pub.json",
);
const pubKeyBuffer = await fs.readFile(pubKeyPath);
const publicKey = JSON.parse(pubKeyBuffer.toString());
test("CASの検証に失敗した場合に閲覧禁止が表示されるか", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  invalidCas: _invalidCas,
  validOps,
  credentialsPage,
}) => {
  await validOps({ publicKey, privateKey }, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});

test("CAの署名がその発行者のOPで配布される検証鍵を使って検証できない場合閲覧禁止", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  validOps: validOps,
  evilCas: evilCas,
  credentialsPage,
}) => {
  await evilCas(credentialsPage.contents, credentialsPage.issuer);
  await validOps({ publicKey, privateKey }, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});

test("OPの署名がその発行者のOPで配布される検証鍵を使って検証できない場合閲覧禁止", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  evilOps: evilOps,
  validCas: validCas,
  credentialsPage,
}) => {
  await validCas(
    { privateKey },
    credentialsPage.contents,
    credentialsPage.issuer,
  );
  await evilOps(publicKey, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
test("OPとCAの署名がその発行者のOPで配布される検証鍵を使って検証できない場合閲覧禁止", async ({
  context,
  page,
  missingSiteProfile: _missingSiteProfile,
  evilOps: evilOps,
  evilCas: evilCas,
  credentialsPage,
}) => {
  await evilCas(credentialsPage.contents, credentialsPage.issuer);
  await evilOps(publicKey, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
