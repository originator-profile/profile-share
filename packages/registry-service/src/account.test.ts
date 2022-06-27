import { test, expect, describe, afterEach } from "vitest";
import { mock, mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import Ajv from "ajv";
import { expand, JsonLdDocument } from "jsonld";
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
    const op = await expand(data);
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
    expect(prisma.keys.create.call.length).toBe(1);
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
    expect(prisma.publications.create.call.length).toBe(1);
  });
});
