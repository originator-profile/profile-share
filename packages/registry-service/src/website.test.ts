import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { generateKey } from "@webdino/profile-sign";
import Config from "./config";
import { WebsiteService } from "./website";

const config: Config = {
  ISSUER_UUID: "d613c1d6-5312-41e9-98ad-2b99765955b6",
  APP_URL: "http://localhost:8080",
};

describe("WebsiteService", () => {
  const prisma = mockDeep<PrismaClient>();

  afterEach(() => {
    mockClear(prisma);
  });

  test("create() calls prisma.websites.create()", async () => {
    prisma.websites.create.mockRejectedValue({});
    const website: WebsiteService = WebsiteService({ config, prisma });
    const accountId = crypto.randomUUID();
    const input: Prisma.websitesCreateInput = {
      account: { connect: { id: accountId } },
      url: "http://localhost:8080/",
      location: "h1",
      bodyFormat: { connect: { value: "html" } },
      title: "OP 確認くん",
      proofJws:
        "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..RTQpkRZ81kVLRcVp3kqDVM_EBq35qF0c1Z1vzYUfb6z5MoyDd1BDn482qLS6vkD9NkefPwiwVkv58GHAZ6qvPA",
    };
    await website.create(input);
    // @ts-expect-error assert
    expect(prisma.websites.create.calls.length).toBe(1);
  });

  test("signBody() return compact JWS", async () => {
    const website: WebsiteService = WebsiteService({ config, prisma });
    const { pkcs8 } = await generateKey();
    const body = "<h1>OP 確認くん</h1>";
    const jws = await website.signBody(pkcs8, body);
    expect(jws).toBeTypeOf("string");
    expect((jws as string).split(".").length).toBe(3);
  });
});
