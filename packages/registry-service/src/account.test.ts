import { test, expect, describe, afterEach } from "vitest";
import { mock, mockDeep, mockClear } from "vitest-mock-extended";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import Ajv from "ajv";
import jsonld, { JsonLdDocument } from "jsonld";
import { Jwks } from "@webdino/profile-model";
import Config from "./config";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";

const config: Config = { ISSUER_UUID: "d613c1d6-5312-41e9-98ad-2b99765955b6" };
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
      config,
      prisma,
      validator,
    });
    const input: Prisma.accountsCreateInput = {
      domainName: "localhost",
      role: { connect: { value: "certifier" } },
      name: "一般社団法人 WebDINO Japan",
      url: "https://www.webdino.org/",
      postalCode: "103-0006",
      addressCountry: "JP",
      addressRegion: "東京都",
      addressLocality: "中央区",
      streetAddress: "日本橋富沢町 10-13 WORK EDITION NIHONBASHI 3F",
      contactTitle: "お問い合わせ",
      contactUrl: "https://www.webdino.org/contact/",
      privacyPolicyTitle: "個人情報保護方針",
      privacyPolicyUrl: "https://www.webdino.org/privacy/",
      logos: {
        create: [
          { url: "https://localhost:8080/logos/horizontal-webdino.jpg" },
          {
            url: "http://localhost:8080/logos/square-webdino.jpg",
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
      config,
      prisma,
      validator,
    });
    // @ts-expect-error assert
    const data: Jwks = await account.getKeys(crypto.randomUUID());
    const valid = ajv.validate(Jwks, data);
    expect(valid).toBe(true);
  });

  test("getProfiles() returns valid JSON-LD", async () => {
    const publications = mock<typeof prisma.publications>();
    // @ts-expect-error assert
    prisma.accounts.findUnique.mockReturnValue({
      publications: publications.findMany,
    });
    publications.findMany.mockResolvedValue([
      // @ts-expect-error assert
      { op: { id: opId, jwt: "jwt" }, account: { url: "url" } },
    ]);

    const account: AccountService = AccountService({
      config,
      prisma,
      validator,
    });
    // @ts-expect-error assert
    const data: JsonLdDocument = await account.getProfiles(crypto.randomUUID());
    const op = await jsonld.expand(data);
    expect("https://github.com/webdino/profile#main" in op[0]).toBe(true);
    expect("https://github.com/webdino/profile#profile" in op[0]).toBe(true);
  });

  test("registerKey() calls prisma.keys.create()", async () => {
    const jwk = { kid: "1", kty: "RSA", n: "1", e: "1" };
    prisma.keys.create.mockResolvedValue({ id: 1, accountId, jwk });
    const account: AccountService = AccountService({
      config,
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
      config,
      prisma,
      validator,
    });
    await account.publishProfile(accountId, opId);
    // @ts-expect-error assert
    expect(prisma.publications.create.calls.length).toBe(1);
  });
});
