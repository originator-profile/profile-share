import { expect, popup, test as base } from "./fixtures";

const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("http://localhost:8080/examples/cas.json", async (route) =>
      route.fulfill({
        status: 404,
      }),
    );
    await page.route("http://localhost:8080/examples/ops.json", async (route) =>
      route.fulfill({
        status: 404,
      }),
    );
    await page.route(
      "http://localhost:8080/.well-known/sp.json",
      async (route) =>
        route.fulfill({
          status: 404,
        }),
    );
    await use(page);
  },
});

test("Site Profile と OPS/CAS が取得できない場合", async ({
  context,
  page,
}) => {
  await page.goto("http://localhost:8080/examples/cas-2.html");
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-unsupported-message")).toBeVisible();
});
