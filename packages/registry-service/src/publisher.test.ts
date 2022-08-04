import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient, websites } from "@prisma/client";
import crypto from "node:crypto";
import { addYears, getUnixTime } from "date-fns";
import { decodeJwt, generateKeyPair, SignJWT } from "jose";
import { JwtDpPayload } from "@webdino/profile-model";
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

  test("signDp() return a valid JWT", async () => {
    const accountId = crypto.randomUUID();
    const url = "http://localhost:8080/";
    const dummyWebsite: Partial<websites> = {
      accountId,
      url,
      location: "h1",
      bodyFormatValue: "html",
      title: "OP 確認くん",
      proofJws:
        "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..RTQpkRZ81kVLRcVp3kqDVM_EBq35qF0c1Z1vzYUfb6z5MoyDd1BDn482qLS6vkD9NkefPwiwVkv58GHAZ6qvPA",
    };
    prisma.accounts.findUnique.mockResolvedValue({
      id: accountId,
      url: "http://localhost:8080",
      // @ts-expect-error include websites
      websites: [dummyWebsite],
    });
    const { pkcs8 } = await generateKey();
    const jwt = await publisher.signDp(accountId, url, pkcs8);
    // @ts-expect-error assert
    const valid: JwtDpPayload = decodeJwt(jwt);
    expect(valid).toMatchObject({
      iss: "http://localhost:8080",
      sub: url,
      "https://opr.webdino.org/jwt/claims/dp": {},
    });
    const website = valid["https://opr.webdino.org/jwt/claims/dp"].item.find(
      ({ type }) => type === "website"
    );
    expect(website?.url).toBe(url);
  });

  test("issueDp() calls prisma.dps.create()", async () => {
    const accountId = crypto.randomUUID();
    const issuer = "http://iss.example.org";
    const issuedAt = new Date();
    const subject = "http://iss.example.com/article/42";
    const expiredAt = addYears(new Date(), 10);
    const { privateKey } = await generateKeyPair("ES256");
    const dpId: string = crypto.randomUUID();
    const jwt = await new SignJWT({
      "https://opr.webdino.org/jwt/claims/dp": { item: [] },
    })
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
      websiteId: null,
    });
    const data = await publisher.issueDp(accountId, jwt);
    // @ts-expect-error assert
    expect(prisma.dps.create.calls.length).toBe(1);
    expect(data).toBe(dpId);
  });
});
