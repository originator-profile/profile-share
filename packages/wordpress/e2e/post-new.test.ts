import { test, expect } from "@wordpress/e2e-test-utils-playwright";
import path from "node:path";
import fs from "node:fs/promises";

test("投稿の検証", async ({ admin, editor }) => {
  await admin.createNewPost({
    content: "海は昼眠る、夜も眠る。ごうごう、いびきをかいて眠る。",
  });

  const page = await editor.openPreviewPage();
  await page.waitForSelector(".wp-block-post-content");
  const locators = await page
    .locator(".wp-block-post-content>*:not(.post-nav-links)")
    .all();
  const text = (
    await Promise.all(locators.map((loc) => loc.textContent()))
  ).join("");
  expect(text).toMatchSnapshot("post.txt");

  const postId = await editor.publishPost();
  const post = (
    await fs.readFile(
      path.join(
        __dirname,
        "../tmp/profile-test-snapshots",
        `${postId}.1.snapshot.txt`,
      ),
    )
  ).toString();
  expect(text, "transition_post_statusフックで得られる内容と一致").toBe(post);

  const link = await page
    .locator(`link[rel="alternate"][type="application/ld+json"][href^="http"]`)
    .all();
  expect(link, "link要素を含む").toHaveLength(1);
});
