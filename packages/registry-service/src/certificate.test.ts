import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { addYears, getUnixTime } from "date-fns";
import { decodeJwt, generateKeyPair, SignJWT } from "jose";
import { JwtOpPayload } from "@webdino/profile-model";
import { generateKey } from "@webdino/profile-sign";
import { isOpHolder, isOpCredential } from "@webdino/profile-core";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";
import { CertificateService } from "./certificate";

const certifierId: string = crypto.randomUUID();

describe("CertificateService", () => {
  const prisma = mockDeep<PrismaClient>();
  const validator = ValidatorService();
  const account = AccountService({ prisma, validator });
  const certificate = CertificateService({ prisma, account, validator });

  afterEach(() => {
    mockClear(prisma);
  });

  test("isCertifier() return true if account is certifier", async () => {
    prisma.accounts.findUnique.mockResolvedValue(
      // @ts-expect-error assert
      { id: certifierId, roleValue: "certifier" }
    );
    const data = await certificate.isCertifier(certifierId);
    expect(data).toBe(true);
  });

  test("signOp() return a valid JWT", async () => {
    const id = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const { jwk, pkcs8 } = await generateKey();
    const dummyAccount = {
      roleValue: "certifier",
      name: "WebDINO Japan OPR",
      description: "Profile Registry (Demo)",
      email: "example@webdino.org",
      phoneNumber: null,
      postalCode: "123-4567",
      addressCountry: "JP",
      addressRegion: "東京都",
      addressLocality: "中央区",
      streetAddress: "日本橋富沢町 10-13 WORK EDITION NIHONBASHI 3F",
      contactTitle: "お問い合わせ",
      contactUrl: "https://www.webdino.org/contact/",
      privacyPolicyTitle: "個人情報保護方針",
      privacyPolicyUrl: "https://www.webdino.org/privacy/",
      publishingPrincipleTitle: "編集ガイドライン",
      publishingPrincipleUrl: "https://www.webdino.org/publishing-principle/",
    };
    prisma.credentials.findMany.mockResolvedValue([
      {
        id: 1,
        accountId,
        certifierId: id,
        verifierId: id,
        name: "セーフティブランド認証",
        image: null,
        issuedAt: new Date(),
        expiredAt: new Date(),
      },
    ]);
    prisma.accounts.findMany.mockResolvedValue([
      {
        id,
        ...dummyAccount,
        domainName: "example.org",
        url: "https://example.org/",
      },
    ]);
    prisma.accounts.findUnique.mockResolvedValue({
      id: accountId,
      ...dummyAccount,
      domainName: "example.com",
      url: "https://example.com/",
    });
    prisma.keys.findMany.mockResolvedValue([
      { id: 1, accountId, jwk: jwk as Prisma.JsonValue },
    ]);
    const jwt = await certificate.signOp(id, accountId, pkcs8);
    // @ts-expect-error assert
    const valid: JwtOpPayload = decodeJwt(jwt);
    expect(valid).toMatchObject({
      iss: "example.org",
      sub: "example.com",
      "https://opr.webdino.org/jwt/claims/op": { jwks: { keys: [jwk] } },
    });
    const holder =
      valid["https://opr.webdino.org/jwt/claims/op"].item.find(isOpHolder);
    expect(holder?.url).toBe("https://example.com/");
    expect(holder).not.toHaveProperty("phoneNumber");
    const credential =
      valid["https://opr.webdino.org/jwt/claims/op"].item.find(isOpCredential);
    expect(credential?.name).toBe("セーフティブランド認証");
  });

  test("issue() calls prisma.ops.create()", async () => {
    const issuer = "example.org";
    const issuedAt = new Date();
    const subject = "example.com";
    const expiredAt = addYears(new Date(), 10);
    const { privateKey } = await generateKeyPair("ES256");
    const opId: string = crypto.randomUUID();
    const jwt = await new SignJWT({
      "https://opr.webdino.org/jwt/claims/op": { item: [] },
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuer(issuer)
      .setSubject(subject)
      .setIssuedAt(getUnixTime(issuedAt))
      .setExpirationTime(getUnixTime(expiredAt))
      .sign(privateKey);
    prisma.ops.create.mockResolvedValue({
      id: opId,
      certifierId,
      jwt,
      issuedAt,
      expiredAt,
    });
    const data = await certificate.issue(certifierId, jwt);
    // @ts-expect-error assert
    expect(prisma.ops.create.calls.length).toBe(1);
    expect(data).toBe(opId);
  });
});
