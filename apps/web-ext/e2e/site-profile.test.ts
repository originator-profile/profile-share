import { expect, popup, test as base } from "./fixtures";
import { SiteProfile } from "@originator-profile/model";

const test = base.extend({
  page: async ({ page }, use) => {
    /* TODO: 正しい内容の Site Profile でテストして */
    const sp: SiteProfile = {
      originators: [
        {
          core: "",
          annotations: [],
          media: "",
        },
      ],
      credential: "",
    };
    await page.route(
      "http://localhost:8080/.well-known/sp.json",
      async (route) =>
        route.fulfill({
          body: JSON.stringify(sp),
          contentType: "application/json",
        }),
    );
    await use(page);
  },
});

/* TODO: Site Profile の表示がされるようになったらテストをする */
test.skip("Site Profile を取得検証できる", async ({ context, page }) => {
  await page.goto("http://localhost:8080/examples/many-dps.html");
  const ext = await popup(context);
  await expect(ext?.getByTestId("site-profile")).toBeVisible();
});
