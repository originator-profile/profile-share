import { expect, popup, test as base } from "./fixtures";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test as siteProfileTest } from "./site-profile-fixtures";
import { test as credntialsTest } from "./credentials-fixtures";
import { test as staticHtmlTest } from "./static-html-fixtures";
import { mergeTests } from "@playwright/test";

const test = mergeTests(
  base,
  siteProfileTest,
  credntialsTest,
  staticHtmlTest,
).extend({});

const cwd = path.dirname(fileURLToPath(new URL(import.meta.url)));
const privKeyPath = path.join(cwd, "./account-key.example.priv.json");
const privKeyBuffer = await fs.readFile(privKeyPath);
const privateKey = JSON.parse(privKeyBuffer.toString());

const pubKeyPath = path.join(cwd, "./account-key.example.pub.json");
const pubKeyBuffer = await fs.readFile(pubKeyPath);
const publicKey = JSON.parse(pubKeyBuffer.toString());
test("CAS/OPSの取得に成功するがSPの検証に失敗した場合閲覧禁止", async ({
  context,
  page,
  invalidSiteProfile: _invalidSiteProfile,
  validCredentials,
  credentialsPage,
}) => {
  await validCredentials(
    { publicKey, privateKey },
    credentialsPage.contents,
    credentialsPage.issuer,
  );
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();

  await expect(ext.getByText("アクセスにはご注意ください")).toHaveCount(1);
  await expect(ext.getByText("このサイトの発信元が確認できません")).toHaveCount(
    1,
  );
  await expect(
    ext.getByText(
      "本物そっくりの偽サイトにログインしたり個人情報を登録したり支払いをしてしまい被害に合うケースが多発しています。このページではサイトの運営者情報が確認できませんでした。そのため、このサイトが本物かどうかは充分に注意してください。",
    ),
  ).toHaveCount(1);
});
test("CAの署名がその発行者のSPで配布される検証鍵を使って検証できない場合閲覧禁止", async ({
  context,
  page,
  validSiteProfile,
  missingOps: _,
  evilCas: evilCas,
  credentialsPage,
}) => {
  await evilCas(credentialsPage.contents, credentialsPage.issuer);
  await validSiteProfile({ privateKey, publicKey }, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
test("SPの署名がその発行者のOPで配布される検証鍵を使って検証できない場合閲覧禁止", async ({
  context,
  page,
  evilSiteProfile,
  missingOps: _,
  validCas: validCas,
  credentialsPage,
}) => {
  await validCas(
    { privateKey },
    credentialsPage.contents,
    credentialsPage.issuer,
  );
  await evilSiteProfile({ publicKey }, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
test("SPとCAの署名がその発行者のOPまたはSPで配布される検証鍵を使って検証できない場合閲覧禁止", async ({
  context,
  page,
  evilSiteProfile,
  missingOps: _,
  evilCas: evilCas,
  credentialsPage,
}) => {
  await evilCas(credentialsPage.contents, credentialsPage.issuer);
  await evilSiteProfile({ publicKey }, credentialsPage.issuer);
  await page.goto(credentialsPage.endpoint);
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
