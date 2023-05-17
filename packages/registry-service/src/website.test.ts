import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { generateKey } from "@webdino/profile-sign";
import { WebsiteService } from "./website";

describe("WebsiteService", () => {
  const prisma = mockDeep<PrismaClient>();

  afterEach(() => {
    mockClear(prisma);
  });

  test("signBody() return compact JWS", async () => {
    const website: WebsiteService = WebsiteService({ prisma });
    const { pkcs8 } = await generateKey();
    const body = "<h1>OP 確認くん</h1>";
    const jws = await website.signBody(pkcs8, body);
    expect(jws).toBeTypeOf("string");
    expect((jws as string).split(".").length).toBe(3);
  });
});
