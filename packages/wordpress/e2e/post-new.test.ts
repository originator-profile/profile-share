import { Page, test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";

test.describe.configure({ mode: "serial" });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:9000/wp-login.php");

  await page.waitForSelector('input[id="user_login"]:focus');

  const wordpressAdminUser = process.env.WORDPRESS_ADMIN_USER!;
  const wordpressAdminPassword = process.env.WORDPRESS_ADMIN_PASSWORD!;
  await page.getByLabel("Username or Email Address").fill(wordpressAdminUser);
  await page
    .getByLabel("Password", { exact: true })
    .fill(wordpressAdminPassword);

  await page.getByRole("button", { name: "Log In" }).click();

  // ログインが成功したことの確認
  expect(page.url()).not.toContain("wp-login.php");
});

test("投稿の検証", async () => {
  await page.goto("http://localhost:9000/wp-admin/post-new.php");

  try {
    // NOTE: 初回のダイアログの表示によって以降の処理が阻まれるのでそれを防ぐために待機して閉じます
    await page.getByRole("button", { name: /Close/ }).click({ timeout: 3_000 });
  } catch {
    // nop
  }

  await page.getByRole("button", { name: "Add block" }).click();
  await page.getByRole("option", { name: "Paragraph" }).click();
  await page
    .getByRole("document", {
      name: "Empty block; start writing or type forward slash to choose a block",
    })
    .fill("海は昼眠る、夜も眠る。ごうごう、いびきをかいて眠る。");

  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page
    .getByRole("region", { name: "Editor publish" })
    .getByRole("button", { name: "Publish", exact: true })
    .click();
  await page.getByRole("link", { name: "(no title)", exact: true }).click();

  const text = await (await page.$(".wp-block-post-content"))?.textContent();
  expect(text).toMatchSnapshot("post.txt");

  const postId = Number(new URL(page.url()).searchParams.get("p"));
  const post = (
    await fs.readFile(
      path.join(
        __dirname,
        "../tmp/profile-test-snapshots",
        `${postId}.snapshot.txt`
      )
    )
  ).toString();
  expect(text, "transition_post_statusフックで得られる内容と一致").toBe(post);

  const link = await page.$$(
    `link[rel="alternate"][type="application/ld+json"][href^="http"]`
  );
  expect(link, "link要素を含む").toHaveLength(1);
});
