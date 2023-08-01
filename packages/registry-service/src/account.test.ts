import { test, expect, describe,  vi } from "vitest";
import crypto from "node:crypto";
import Ajv from "ajv";
import { Jwks } from "@originator-profile/model";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";

import { prisma } from "@originator-profile/registry-db/src/__mocks__/prisma-client";

vi.mock("@originator-profile/registry-db/src/prisma-client.ts");

const accountId: string = crypto.randomUUID();

describe("AccountService", () => {
  const validator = ValidatorService();

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
});
