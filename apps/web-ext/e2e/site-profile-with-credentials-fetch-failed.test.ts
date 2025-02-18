import { expect, popup, test as base } from "./fixtures";
import {
  Certificate,
  SiteProfile,
  WebMediaProfile,
} from "@originator-profile/model";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { signJwtVc } from "@originator-profile/securing-mechanism";
import { addYears } from "date-fns";

const cwd = path.dirname(fileURLToPath(new URL(import.meta.url)));
const privKeyPath = path.join(
  cwd,
  "../../registry/account-key.example.priv.json",
);
const privKeyBuffer = await fs.readFile(privKeyPath);
const privateKey = JSON.parse(privKeyBuffer.toString());

const pubKeyPath = path.join(
  cwd,
  "../../registry/account-key.example.pub.json",
);
const pubKeyBuffer = await fs.readFile(pubKeyPath);
const publicKey = JSON.parse(pubKeyBuffer.toString());

const coreProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
  ],
  type: ["VerifiableCredential", "CoreProfile"],
  issuer: "dns:localhost",
  credentialSubject: {
    id: "dns:localhost",
    type: "Core",
    jwks: {
      keys: [publicKey],
    },
  },
};

const certificate: Certificate = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "Certificate"],
  issuer: "dns:localhost",
  credentialSubject: {
    id: "dns:localhost",
    type: "CertificateProperties",
    description: "Example Certificate",
    certificationSystem: {
      id: "urn:uuid:de5d6e80-10a5-404f-b4d3-e9f0e6926a21",
      type: "CertificationSystem",
      name: "Example Certification System",
      description: "Example Certification System Description",
    },
  },
};

const webMediaProfile: WebMediaProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "WebMediaProfile"],
  issuer: "dns:localhost",
  credentialSubject: {
    id: "dns:localhost",
    type: "OnlineBusiness",
    name: "Originator Profile 技術研究組合 (開発用)",
    url: "http://localhost:8080",
  },
};

const websiteProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "WebsiteProfile"],
  issuer: "dns:localhost",
  credentialSubject: {
    id: "http://localhost:8080",
    url: "http://localhost:8080",
    type: "WebSite",
    name: "SiteProfileの取得検証",
    description: "<Webサイトの説明>",
    image: {
      id: "https://media.example.com/image.png",
    },
  },
};

const test = base.extend({
  page: async ({ page }, use) => {
    const issuedAt: Date = new Date(Date.now());
    const expiredAt: Date = addYears(new Date(), 1);
    const signedCoreProfile = await signJwtVc(coreProfile, privateKey, {
      issuedAt,
      expiredAt,
    });
    const annotations = await signJwtVc(certificate, privateKey, {
      issuedAt,
      expiredAt,
    });
    const signedMediaProfile = await signJwtVc(webMediaProfile, privateKey, {
      issuedAt,
      expiredAt,
    });

    const op = {
      core: signedCoreProfile,
      annotations: [annotations],
      media: signedMediaProfile,
    };

    const signedWebsiteProfile = await signJwtVc(websiteProfile, privateKey, {
      issuedAt,
      expiredAt,
    });

    const sp: SiteProfile = {
      originators: [op],
      credential: signedWebsiteProfile,
    };

    await page.route(
      "http://localhost:8080/.well-known/sp.json",
      async (route) =>
        route.fulfill({
          body: JSON.stringify(sp),
          contentType: "application/json",
        }),
    );

    const htmlContent = `
<!doctype html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>SiteProfile取得検証成功して、OPS/CASの取得失敗する</title>
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
  <p id="text-target-integrity">SiteProfileの取得検証テストWebページ</p>
</body>
</html>`;

    await page.route(
      "http://localhost:8080/examples/site-profile.html",
      async (route) =>
        route.fulfill({
          body: htmlContent,
          contentType: "text/html",
        }),
    );

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

    await use(page);
  },
});

test("SiteProfileは検証成功するが、OPS / CASの取得に失敗した時にSiteProfileの表示がされるか", async ({
  context,
  page,
}) => {
  await page.goto(
    "http://localhost:8080/examples/credentials-fetch-failed.html",
  );
  const ext = await popup(context);
  await expect(ext.getByTestId("site-profile")).toBeVisible();
  expect(await ext.getByTestId("site-profile-wsp-name").innerText()).toBe(
    "SiteProfileの取得検証",
  );

  await expect(ext.locator("main")).toHaveCount(0);
});
