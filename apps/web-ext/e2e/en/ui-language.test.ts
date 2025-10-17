import { expect, popup, test } from "../fixtures";

test("English UI messages are displayed correctly", async ({ context }) => {
  const ext = await popup(context);

  const language = await ext.evaluate(() => navigator.language);
  expect(language).toBe("en-US");

  await expect(
    ext.getByText(
      "Technology to easily distinguish high-quality articles and media",
    ),
    "Verify that the English text is displayed",
  ).toBeVisible();
});
