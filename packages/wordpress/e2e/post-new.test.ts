import { expect, test } from "@wordpress/e2e-test-utils-playwright";

test("投稿の検証", async ({ admin, editor }) => {
  const content = "海は昼眠る、夜も眠る。ごうごう、いびきをかいて眠る。";

  await admin.createNewPost({ content });

  const page = await editor.openPreviewPage();
  const postId = await editor.publishPost();

  const url = new URL(
    `../tmp/profile-test-snapshots/${postId}.1.snapshot.html`,
    `file://${__dirname}/`,
  );

  await page.goto(url.href);

  const text = await page
    .locator(".wp-block-post-content>*:not(.post-nav-links)")
    .allTextContents()
    .then((ts) => ts.join(""));

  expect(text).toBe(content);
});
