import { expect, popup, test as base } from "./fixtures";
import { UnsignedContentAttestation } from "@originator-profile/model";
import { signJwtVc } from "@originator-profile/securing-mechanism";
import { addYears } from "date-fns";
import { signCa } from "../../../packages/sign/src/sign-ca";
import { Window } from "happy-dom";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

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

const htmlContent = `
<!doctype html>
<html lang="ja" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>OPSとCAS</title>
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
  <p id="text-target-integrity">Content Attestationの正常表示テストWebページ</p>
</body>
</html>`;

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

const unsignedContentAttestation: UnsignedContentAttestation = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "ContentAttestation"],
  issuer: "dns:localhost",
  credentialSubject: {
    type: "Article",
    headline: "<Webページのタイトル>",
    image: {
      id: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
    },
    description: "<Webページの説明>",
    author: ["山田花子"],
    editor: ["山田太郎"],
    datePublished: "2023-07-04T19:14:00Z",
    dateModified: "2023-07-04T19:14:00Z",
    genre: "Arts & Entertainment",
    id: "urn:uuid:5c464165-c579-4fc9-aaff-ca4a65e79947",
  },
  allowedUrl: "http://localhost:8080/*",
  target: [
    {
      type: "TextTargetIntegrity",
      content: htmlContent,
      cssSelector: "#text-target-integrity",
    },
  ],
};

const test = base.extend({
  page: async ({ page }, use) => {
    const issuedAt: Date = new Date(Date.now());
    const expiredAt: Date = addYears(new Date(), 1);
    const signedCoreProfile = await signJwtVc(coreProfile, privateKey, {
      issuedAt,
      expiredAt,
    });
    const op = {
      core: signedCoreProfile,
    };

    const ca = await signCa(unsignedContentAttestation, privateKey, {
      issuedAt,
      expiredAt,
      documentProvider: async () => {
        const window = new Window();
        window.document.write(htmlContent);
        return window.document as unknown as Document;
      },
    });

    await page.route("http://localhost:8080/examples/cas.html", async (route) =>
      route.fulfill({
        body: htmlContent,
        contentType: "text/html",
      }),
    );

    await page.route("http://localhost:8080/examples/cas.json", async (route) =>
      route.fulfill({
        body: JSON.stringify([
          {
            attestation: ca,
            main: true,
          },
        ]),
        contentType: "application/json",
      }),
    );

    await page.route("http://localhost:8080/examples/ops.json", async (route) =>
      route.fulfill({
        body: JSON.stringify(op),
        contentType: "application/json",
      }),
    );

    await use(page);
  },
});

test("Content Attestation Set の表示が正常に行えたか", async ({
  context,
  page,
}) => {
  await page.goto("http://localhost:8080/examples/cas.html");
  const ext = await popup(context);
  await expect(ext?.getByTestId("cas")).toBeVisible();
});
