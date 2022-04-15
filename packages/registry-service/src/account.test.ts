import { test, expect, describe, afterEach } from "vitest";
import { mock, mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { webcrypto as crypto } from "node:crypto";
import Ajv from "ajv";
import { expand, JsonLdDocument } from "jsonld";
import Jwks from "@webdino/profile-model/src/jwks";
import Config from "./config";
import { AccountService } from "./account";

const config: Config = {
  PORT: "8080",
  ISSUER_UUID: "d613c1d6-5312-41e9-98ad-2b99765955b6",
  JSONLD_CONTEXT: "https://github.com/webdino/profile",
};

// @ts-expect-error assert
const accountId: string = crypto.randomUUID();
// @ts-expect-error assert
const opId: string = crypto.randomUUID();

describe("AccountService", () => {
  const prisma = mockDeep<PrismaClient>();

  afterEach(() => {
    mockClear(prisma);
  });

  test("getKeys() returns valid JWKS", async () => {
    prisma.keys.findMany.mockResolvedValue([
      { id: 1, accountId, jwk: { kid: "1", kty: "RSA", n: "1", e: "1" } },
    ]);

    const ajv = new Ajv();
    const account: AccountService = AccountService({ config, prisma });
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

    const account: AccountService = AccountService({ config, prisma });
    // @ts-expect-error assert
    const data: JsonLdDocument = await account.getProfiles(crypto.randomUUID());
    await expand(data);
  });
});
