import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { addYears, getUnixTime } from "date-fns";
import { decodeJwt, generateKeyPair, SignJWT } from "jose";
import { generateKey, OpPayload } from "@webdino/profile-sign";
import Config from "./config";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";
import { CertificateService } from "./certificate";

const certifierId: string = crypto.randomUUID();
const config: Config = {
  PORT: "8080",
  ISSUER_UUID: "d613c1d6-5312-41e9-98ad-2b99765955b6",
  JSONLD_CONTEXT: "https://github.com/webdino/profile",
};

describe("CertificateService", () => {
  const prisma = mockDeep<PrismaClient>();
  const validator = ValidatorService();
  const account = AccountService({ config, prisma, validator });
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
      phoneNumber: "0123456789",
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
    // @ts-expect-error assert
    prisma.accounts.findUnique.mockImplementation(async (input) => ({
      id: input.where.id,
      ...dummyAccount,
      url: input.where.id === id ? "http://iss.example" : "http://sub.example",
    }));
    prisma.keys.findMany.mockResolvedValue([
      { id: 1, accountId, jwk: jwk as Prisma.JsonValue },
    ]);
    const jwt = await certificate.signOp(id, accountId, pkcs8);
    // @ts-expect-error assert
    const valid: OpPayload = decodeJwt(jwt);
    expect(valid).toMatchObject({
      iss: "http://iss.example",
      sub: "http://sub.example",
      "https://opr.webdino.org/jwt/claims/op": { jwks: { keys: [jwk] } },
    });
    expect(
      valid["https://opr.webdino.org/jwt/claims/op"].item.find(
        ({ type }) => type === "holder"
      )?.url
    ).toBe("http://sub.example");
  });

  test("issue() calls prisma.ops.create()", async () => {
    const issuer = "http://iss.example.org";
    const issuedAt = new Date();
    const subject = "http://sub.example.com";
    const expiredAt = addYears(new Date(), 10);
    const { privateKey } = await generateKeyPair("ES256");
    const opId: string = crypto.randomUUID();
    const jwt = await new SignJWT({})
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
    expect(prisma.ops.create.call.length).toBe(1);
    expect(data).toBe(opId);
  });
});
