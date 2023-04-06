import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import Ajv from "ajv";
import { Jwks } from "@webdino/profile-model";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";

const accountId: string = crypto.randomUUID();
const opId: string = crypto.randomUUID();

describe("AccountService", () => {
  const prisma = mockDeep<PrismaClient>();
  const validator = ValidatorService();

  afterEach(() => {
    mockClear(prisma);
  });

  test("create() calls prisma.accounts.create()", async () => {
    prisma.accounts.create.mockRejectedValue({});
    const account: AccountService = AccountService({
      prisma,
      validator,
    });
    const input: Prisma.accountsCreateInput = {
      domainName: "localhost",
      role: { connect: { value: "certifier" } },
      name: "Originator Profile 技術研究組合",
      url: "https://originator-profile.org/",
      postalCode: "108-0073",
      addressCountry: "JP",
      addressRegion: "東京都",
      addressLocality: "港区",
      streetAddress: "三田",
      contactTitle: "お問い合わせ",
      contactUrl: "https://originator-profile.org/ja-JP/",
      logos: {
        create: [
          {
            url: "https://originator-profile.org/image/icon.svg",
            isMain: true,
          },
        ],
      },
    };
    await account.create(input);
    // @ts-expect-error assert
    expect(prisma.accounts.create.calls.length).toBe(1);
  });

  test("getKeys() returns valid JWKS", async () => {
    prisma.keys.findMany.mockResolvedValue([
      { id: 1, accountId, jwk: { kid: "1", kty: "RSA", n: "1", e: "1" } },
    ]);

    const ajv = new Ajv();
    const account: AccountService = AccountService({
      prisma,
      validator,
    });
    // @ts-expect-error assert
    const data: Jwks = await account.getKeys(crypto.randomUUID());
    const valid = ajv.validate(Jwks, data);
    expect(valid).toBe(true);
  });

  test("registerKey() calls prisma.keys.create()", async () => {
    const jwk = { kid: "1", kty: "RSA", n: "1", e: "1" };
    prisma.keys.create.mockResolvedValue({ id: 1, accountId, jwk });
    const account: AccountService = AccountService({
      prisma,
      validator,
    });
    const data = await account.registerKey(accountId, jwk);
    // @ts-expect-error assert
    expect(prisma.keys.create.calls.length).toBe(1);
    expect(data).toMatchObject({ keys: [jwk] });
  });

  test("publishProfile() calls prisma.publications.create()", async () => {
    prisma.publications.create.mockResolvedValue({
      accountId,
      opId,
      publishedAt: new Date(),
      // @ts-expect-error assert
      op: { id: opId, jwt: "jwt" },
    });
    const account: AccountService = AccountService({
      prisma,
      validator,
    });
    await account.publishProfile(accountId, opId);
    // @ts-expect-error assert
    expect(prisma.publications.create.calls.length).toBe(1);
  });
});
