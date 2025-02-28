// TODO:
// 名前等に違和感があるので
// https://github.com/originator-profile/profile/issues/1925
// このタスク対応でテストの見直しをしたほうが良さそう
import { expect, popup, test as base } from "./fixtures";
import { ContentAttestationSet } from "@originator-profile/model";

const test = base.extend({
  page: async ({ page }, use) => {
    /* Verify失敗するContent Attestation Set */
    const cas: ContentAttestationSet = [
      {
        attestation: "",
        main: true,
      },
    ];
    await page.route("http://localhost:8080/examples/cas.json", async (route) =>
      route.fulfill({
        body: JSON.stringify(cas),
        contentType: "application/json",
      }),
    );
    await use(page);
  },
});

test("Content Attestation Set の検証に失敗した場合", async ({
  context,
  page,
}) => {
  await page.goto("http://localhost:8080/examples/cas-2.html");
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
