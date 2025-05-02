import {
  ContentAttestationSet,
  Jwk,
  UnsignedContentAttestation,
} from "@originator-profile/model";
import { signJwtVc } from "@originator-profile/securing-mechanism";
import { test as base, Page } from "@playwright/test";
import { addYears } from "date-fns";
import {
  generateCoreProfileData,
  generateUnsignedContentAttestation,
  generateCertificateData,
  generateWebMediaProfileData,
} from "./data";
import { signCa } from "../../../packages/sign/src/sign-ca";
import { Window } from "happy-dom";

type TestFixtures = {
  validCredentials: (
    key: { publicKey: Jwk; privateKey: Jwk },
    contents: string,
  ) => Promise<void>;
  missingCredentials: void;
  validCas: (key: { privateKey: Jwk }, contents: string) => Promise<void>;
  validOps: (key: { publicKey: Jwk; privateKey: Jwk }) => Promise<void>;
  invalidCas: void;
  missingCas: void;
  missingOps: void;
};

const casEndpoint: string = "http://localhost:8080/examples/cas.json";
const opsEndpoint: string = "http://localhost:8080/examples/ops.json";

export const test = base.extend<TestFixtures>({
  validCredentials: async ({ page }: { page: Page }, use) => {
    await use(
      async (key: { publicKey: Jwk; privateKey: Jwk }, contents: string) => {
        const { publicKey, privateKey } = key;
        const issuedAt: Date = new Date(Date.now());
        const expiredAt: Date = addYears(new Date(), 1);
        const unsignedContentAttestation: UnsignedContentAttestation =
          generateUnsignedContentAttestation(contents);
        const contentAttestation = await signCa(
          unsignedContentAttestation,
          privateKey,
          {
            issuedAt,
            expiredAt,
            documentProvider: async () => {
              const window = new Window();
              window.document.write(contents);
              return window.document as unknown as Document;
            },
          },
        );

        const signedCoreProfile = await signJwtVc(
          generateCoreProfileData(publicKey),
          privateKey,
          {
            issuedAt,
            expiredAt,
          },
        );
        const annotations = await signJwtVc(
          generateCertificateData(),
          privateKey,
          {
            issuedAt,
            expiredAt,
          },
        );
        const signedMediaProfile = await signJwtVc(
          generateWebMediaProfileData(),
          privateKey,
          {
            issuedAt,
            expiredAt,
          },
        );

        await page.route(casEndpoint, async (route) =>
          route.fulfill({
            body: JSON.stringify([
              {
                attestation: contentAttestation,
                main: true,
              },
            ]),
            contentType: "application/json",
          }),
        );

        await page.route(opsEndpoint, async (route) =>
          route.fulfill({
            body: JSON.stringify({
              core: signedCoreProfile,
              annotations: [annotations],
              media: signedMediaProfile,
            }),
            contentType: "application/json",
          }),
        );
      },
    );

    await page.unroute(casEndpoint);
    await page.unroute(opsEndpoint);
  },
  missingCredentials: async ({ page }: { page: Page }, use) => {
    await page.route(casEndpoint, async (route) =>
      route.fulfill({
        status: 404,
      }),
    );
    await page.route(opsEndpoint, async (route) =>
      route.fulfill({
        status: 404,
      }),
    );

    await use(undefined);

    await page.unroute(casEndpoint);
    await page.unroute(opsEndpoint);
  },
  validCas: async ({ page }: { page: Page }, use) => {
    await use(async (key: { privateKey: Jwk }, contents: string) => {
      const { privateKey } = key;
      const issuedAt: Date = new Date(Date.now());
      const expiredAt: Date = addYears(new Date(), 1);
      const unsignedContentAttestation: UnsignedContentAttestation =
        generateUnsignedContentAttestation(contents);
      const contentAttestation = await signCa(
        unsignedContentAttestation,
        privateKey,
        {
          issuedAt,
          expiredAt,
          documentProvider: async () => {
            const window = new Window();
            window.document.write(contents);
            return window.document as unknown as Document;
          },
        },
      );

      await page.route(casEndpoint, async (route) =>
        route.fulfill({
          body: JSON.stringify([
            {
              attestation: contentAttestation,
              main: true,
            },
          ]),
          contentType: "application/json",
        }),
      );
    });

    await page.unroute(casEndpoint);
  },
  validOps: async ({ page }: { page: Page }, use) => {
    await use(async (key: { publicKey: Jwk; privateKey: Jwk }) => {
      const { publicKey, privateKey } = key;
      const issuedAt: Date = new Date(Date.now());
      const expiredAt: Date = addYears(new Date(), 1);
      const signedCoreProfile = await signJwtVc(
        generateCoreProfileData(publicKey),
        privateKey,
        {
          issuedAt,
          expiredAt,
        },
      );
      const annotations = await signJwtVc(
        generateCertificateData(),
        privateKey,
        {
          issuedAt,
          expiredAt,
        },
      );
      const signedMediaProfile = await signJwtVc(
        generateWebMediaProfileData(),
        privateKey,
        {
          issuedAt,
          expiredAt,
        },
      );

      await page.route(opsEndpoint, async (route) =>
        route.fulfill({
          body: JSON.stringify({
            core: signedCoreProfile,
            annotations: [annotations],
            media: signedMediaProfile,
          }),
          contentType: "application/json",
        }),
      );

      await page.unroute(opsEndpoint);
    });
  },
  invalidCas: async ({ page }: { page: Page }, use) => {
    const cas: ContentAttestationSet = [
      {
        attestation: "",
        main: true,
      },
    ];
    await page.route(casEndpoint, async (route) =>
      route.fulfill({
        body: JSON.stringify(cas),
        contentType: "application/json",
      }),
    );

    await use(undefined);

    await page.unroute(casEndpoint);
  },
  missingCas: async ({ page }: { page: Page }, use) => {
    await page.route(casEndpoint, async (route) =>
      route.fulfill({
        status: 404,
      }),
    );

    await use(undefined);

    await page.unroute(casEndpoint);
  },
  missingOps: async ({ page }: { page: Page }, use) => {
    await page.route(opsEndpoint, async (route) =>
      route.fulfill({
        status: 404,
      }),
    );

    await use(undefined);

    await page.unroute(opsEndpoint);
  },
});
