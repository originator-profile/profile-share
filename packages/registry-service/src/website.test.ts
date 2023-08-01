import { test, expect, describe, vi } from "vitest";
import { WebsiteRepository } from "@originator-profile/registry-db";
import { generateKey } from "@originator-profile/sign";
import { WebsiteService } from "./website";
import { prisma } from "@originator-profile/registry-db/src/lib/__mocks__/prisma-client";

vi.mock("@originator-profile/registry-db/src/lib/prisma-client.ts");

describe("WebsiteService", () => {
  test("signBody() return compact JWS", async () => {
    const websiteRepository = WebsiteRepository();
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
