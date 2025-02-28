import { test as base, Page } from "@playwright/test";

type TestFixtures = {
  credentialsMissingPage: { contents: string; endpoint: string };
  credentialsPage: { contents: string; endpoint: string };
};

export const test = base.extend<TestFixtures>({
  // ops/casが未設置のhtml
  credentialsMissingPage: async ({ page }: { page: Page }, use) => {
    const credentialsMissingHtml = `
<!doctype html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>OPSとCASが未設置のテストページ</title>
</head>
<body>
  <p id="text-target-integrity">OPSとCASが未設置のテストページ</p>
</body>
</html>`;

    const endpoint = "http://localhost:8080/examples/credentials-missing.html";
    await page.route(endpoint, async (route) =>
      route.fulfill({
        body: credentialsMissingHtml,
        contentType: "text/html",
      }),
    );

    await use({ contents: credentialsMissingHtml, endpoint });

    await page.unroute(endpoint);
  },
  credentialsPage: async ({ page }: { page: Page }, use) => {
    const endpoint = "http://localhost:8080/examples/credentials.html";
    const validCredentialsHtml = `
<!doctype html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>正常なCAS/OPSが設置されているテストページ</title>
</head>
<body>
  <script
    src="http://localhost:8080/examples/ops.json"
    type="application/ops+json"
  ></script>
  <script
    src="http://localhost:8080/examples/cas.json"
    type="application/cas+json"
  ></script>
  <p id="text-target-integrity">正常なCAS/OPSが設置されているテストページ</p>
</body>
</html>`;
    await page.route(endpoint, async (route) =>
      route.fulfill({
        body: validCredentialsHtml,
        contentType: "text/html",
      }),
    );

    await use({ contents: validCredentialsHtml, endpoint });

    await page.unroute(endpoint);
  },
});
