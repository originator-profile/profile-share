import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { addYears, getUnixTime } from "date-fns";
import { decodeJwt, generateKeyPair, SignJWT } from "jose";
import JwtDpPayload from "@webdino/profile-model/src/jwt-dp-payload";
import { generateKey } from "@webdino/profile-sign";
import { ValidatorService } from "./validator";
import { PublisherService } from "./publisher";

describe("PublisherService", () => {
  const prisma = mockDeep<PrismaClient>();
  const validator = ValidatorService();
  const publisher = PublisherService({ prisma, validator });

  afterEach(() => {
    mockClear(prisma);
  });

  test("registerWebsite() calls prisma.websites.create()", async () => {
    const accountId = crypto.randomUUID();
    const website = {
      type: "website" as const,
      url: "http://iss.example/article/42",
      title: "Article 42",
      image: "http://iss.example/asset/image.png",
      description: "The article",
      "https://schema.org/author": "執筆太郎",
      "https://schema.org/category": "Sports>Baseball",
      "https://schema.org/editor": "編集部",
    };
    const input = {
      url: website.url,
      location: "h1",
      bodyFormat: "visibleText" as const,
      body: "Hello, World!",
      website,
    };
    const { pkcs8 } = await generateKey();
    // @ts-expect-error assert
    prisma.accounts.findUnique.mockResolvedValue({
      id: accountId,
      url: "http://iss.example",
    });
    prisma.websites.create.mockResolvedValue({
      id: 1,
      accountId,
      url: website.url,
      title: website.title,
      image: website.image,
      description: website.description,
      author: website["https://schema.org/author"],
      category: website["https://schema.org/category"],
      editor: website["https://schema.org/editor"],
      location: input.location,
      bodyFormatValue: input.bodyFormat,
      proofJws: "jws",
    });
    const jwt = await publisher.registerWebsite(accountId, pkcs8, input);
    expect(prisma.websites.create.call.length).toBe(1);
    // @ts-expect-error assert
    const valid: JwtDpPayload = decodeJwt(jwt);
    expect(valid).toMatchObject({
      iss: "http://iss.example",
      sub: "http://iss.example/article/42",
      "https://opr.webdino.org/jwt/claims/dp": {
        item: expect.arrayContaining([
          website,
          {
            type: "visibleText",
            url: input.url,
            location: input.location,
            proof: { jws: "jws" },
          },
        ]),
      },
    });
  });

  test("issueDp() calls prisma.dps.create()", async () => {
    const accountId = crypto.randomUUID();
    const issuer = "http://iss.example.org";
    const issuedAt = new Date();
    const subject = "http://iss.example.com/article/42";
    const expiredAt = addYears(new Date(), 10);
    const { privateKey } = await generateKeyPair("ES256");
    const dpId: string = crypto.randomUUID();
    const jwt = await new SignJWT({})
      .setProtectedHeader({ alg: "ES256" })
      .setIssuer(issuer)
      .setSubject(subject)
      .setIssuedAt(getUnixTime(issuedAt))
      .setExpirationTime(getUnixTime(expiredAt))
      .sign(privateKey);
    prisma.dps.create.mockResolvedValue({
      id: dpId,
      issuerId: accountId,
      jwt,
      issuedAt,
      expiredAt,
    });
    const data = await publisher.issueDp(accountId, jwt);
    expect(prisma.dps.create.call.length).toBe(1);
    expect(data).toBe(dpId);
  });
});
