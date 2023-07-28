import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { WebsiteRepository } from "@originator-profile/registry-db";
import { generateKey } from "@originator-profile/sign";
import { WebsiteService } from "./website";

describe("WebsiteService", () => {
  const prisma = mockDeep<PrismaClient>();

  afterEach(() => {
    mockClear(prisma);
  });

  test("signBody() return compact JWS", async () => {
    const websiteRepository = WebsiteRepository({ prisma });
    const website: WebsiteService = WebsiteService({
      prisma,
      websiteRepository,
    });
    const { privateKey } = await generateKey();
    const body = "<h1>OP 確認くん</h1>";
    const jws = await website.signBody(privateKey, body);
    expect(jws).toBeTypeOf("string");
    expect((jws as string).split(".").length).toBe(3);
  });
});
