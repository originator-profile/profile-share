import { expect, popup, test as base } from "./fixtures";
import { execSync } from "node:child_process";
import { SingleWebAssertionSet } from "@originator-profile/model";

const test = base.extend({
  page: async ({ page }, use) => {
    const op = execSync(
      "bin/dev cert:issue -i account-key.example.priv.json --issuer localhost --holder localhost --format sd-jwt",
      { cwd: "../registry" },
    );
    const metadata: SingleWebAssertionSet = {
      type: "was",
      originator: op.toString(),
      certificates: ["certificate"],
      assertions: ["assertion"],
      main: false,
    };
    await page.route(
      "http://localhost:8080/.well-known/was.json",
      async (route) =>
        route.fulfill({
          body: JSON.stringify(metadata),
          contentType: "application/json",
        }),
    );
    await use(page);
  },
});

test("Website Metadata を取得検証できる", async ({ context, page }) => {
  await page.goto("http://localhost:8080/examples/many-dps.html");
  const ext = await popup(context);
  await expect(ext?.getByTestId("website-metadata")).toBeVisible();
});
