import { test, expect, describe, vi } from "vitest";
import crypto from "node:crypto";
import Ajv from "ajv";
import { BadRequestError } from "http-errors-enhanced";
import { Jwks } from "@originator-profile/model";
import { generateKey } from "@originator-profile/cryptography";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";

import { prisma } from "@originator-profile/registry-db/src/lib/__mocks__/prisma-client";

vi.mock("@originator-profile/registry-db/src/lib/prisma-client.ts");

const accountId: string = crypto.randomUUID();

describe("AccountService", () => {
  const validator = ValidatorService();

  test("getKeys() returns valid JWKS", async () => {
    prisma.keys.findMany.mockResolvedValue([
      { id: "1", accountId, jwk: { kid: "1", kty: "RSA", n: "1", e: "1" } },
    ]);

    const ajv = new Ajv();
    const account: AccountService = AccountService({
      validator,
    });
    const data: Jwks = await account.getKeys(crypto.randomUUID());
    const valid = ajv.validate(Jwks, data);
    expect(valid).toBe(true);
  });

  test("registerKey()はプライベート鍵を許可しない", async () => {
    const { privateKey } = await generateKey();
    const promise = AccountService({ validator }).registerKey(
      accountId,
      privateKey,
    );
    await expect(promise).rejects.toEqual(
      new BadRequestError("Private key not allowed."),
    );
  });
});
