import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient, websites } from "@prisma/client";
import crypto from "node:crypto";
import { decodeJwt } from "jose";
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
    const domainName = "example.com";
    const webpageId = crypto.randomUUID();
    const url = "https://example.com/";
    const dummyWebsite: Partial<websites> = {
      accountId,
      id: webpageId,
      url,
      location: "h1",
      bodyFormatValue: "html",
      title: "OP 確認くん",
      proofJws:
        "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..RTQpkRZ81kVLRcVp3kqDVM_EBq35qF0c1Z1vzYUfb6z5MoyDd1BDn482qLS6vkD9NkefPwiwVkv58GHAZ6qvPA",
    };
    prisma.accounts.findUnique.mockResolvedValue({
      id: accountId,
      domainName,
      // @ts-expect-error include websites
      websites: [dummyWebsite],
    });
    const { pkcs8 } = await generateKey();
    const jwt = await publisher.signDp(accountId, webpageId, pkcs8);
    // @ts-expect-error assert
    const valid: JwtDpPayload = decodeJwt(jwt);
    expect(valid).toMatchObject({
      iss: domainName,
      sub: webpageId,
      "https://originator-profile.org/dp": {},
    });
    const website = valid["https://originator-profile.org/dp"]?.item.find(
      ({ type }) => type === "website"
    );
    expect(website?.url).toBe(url);
  });
});
