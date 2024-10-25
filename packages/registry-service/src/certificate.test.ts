import { test, expect, describe, vi } from "vitest";
import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { generateKey } from "@originator-profile/cryptography";
import { decodeSdJwt } from "@originator-profile/verify";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";
import { CertificateService } from "./certificate";
import { prisma } from "@originator-profile/registry-db/src/lib/__mocks__/prisma-client";

vi.mock("@originator-profile/registry-db/src/lib/prisma-client.ts");

const certifierId: string = crypto.randomUUID();

describe("CertificateService", () => {
  const validator = ValidatorService();
  const account = AccountService({ validator });
  const certificate = CertificateService({ account, validator });

  test("isCertifier() return true if account is certifier", async () => {
    prisma.accounts.findUnique.mockResolvedValue(
      // @ts-expect-error assert
      { id: certifierId, roleValue: "certifier" },
    );
    const data = await certificate.isCertifier(certifierId);
    expect(data).toBe(true);
  });

  test("signOriginatorProfile() return a valid SD-JWT", async () => {
    const issuerId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const { publicKey, privateKey } = await generateKey();
    const dummyAccount = {
      url: "https://originator-profile.org/",
      roleValue: "certifier",
      name: "Originator Profile 技術研究組合",
      description: "Originator Profile Registry (Demo)",
      corporateNumber: "8010005035933",
      email: "example@originator-profile.org",
      phoneNumber: null,
      postalCode: "100-8055",
      addressCountry: "JP",
      addressRegion: "東京都",
      addressLocality: "千代田区",
      streetAddress: "大手町1-7-1",
      contactTitle: "お問い合わせ",
      contactUrl: "https://originator-profile.org/ja-JP/inquiry/",
      privacyPolicyTitle: "プライバシーポリシー",
      privacyPolicyUrl: "https://originator-profile.org/ja-JP/privacy/",
      publishingPrincipleTitle: "編集ガイドライン",
      publishingPrincipleUrl:
        "https://originator-profile.org/ja-JP/publishing-principle/",
    };
    prisma.credentials.findMany.mockResolvedValue([
      {
        id: 1,
        accountId,
        // @ts-expect-error assert
        certifier: {
          id: issuerId,
          ...dummyAccount,
          domainName: "example.com",
          url: "https://example.",
        },
        certifierId: issuerId,
        verifier: {
          id: issuerId,
          ...dummyAccount,
          domainName: "example.com",
          url: "https://example.",
        },
        verifierId: issuerId,
        name: "ブランドセーフティ認証",
        image: null,
        issuedAt: new Date(),
        expiredAt: new Date(),
      },
    ]);

    prisma.accounts.findUnique
      .mockResolvedValueOnce({
        id: issuerId,
        ...dummyAccount,
        domainName: "example.org",
        url: "https://example.org/",
      })
      .mockResolvedValueOnce({
        id: accountId,
        ...dummyAccount,
        domainName: "example.com",
        url: "https://example.com/",
      });
    prisma.keys.findMany.mockResolvedValue([
      { id: publicKey.kid, accountId, jwk: publicKey as Prisma.JsonValue },
    ]);
    const sdJwt = await certificate.signOriginatorProfile(
      issuerId,
      accountId,
      privateKey,
    );
    const valid = decodeSdJwt(sdJwt);
    expect(valid).toMatchObject({
      iss: "https://example.org/",
      sub: "example.com",
      jwks: { keys: [publicKey] },
      holder: { url: "https://example.com/" },
      issuer: { url: "https://example.org/" },
    });
    expect(valid.holder).not.toHaveProperty("phoneNumber");
  });
});
