import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { generateKey } from "@webdino/profile-sign";
import Config from "./config";
import { WebsiteService } from "./website";

const config: Config = { ISSUER_UUID: "d613c1d6-5312-41e9-98ad-2b99765955b6" };

describe("WebsiteService", () => {
  const prisma = mockDeep<PrismaClient>();

  afterEach(() => {
    mockClear(prisma);
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
