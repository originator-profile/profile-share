import { test, expect, describe, vi } from "vitest";
import crypto from "node:crypto";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";
import { CertificateService } from "./certificate";
import { prisma } from "@originator-profile/registry-db/src/lib/__mocks__/prisma-client";

vi.mock("@originator-profile/registry-db/src/lib/prisma-client.ts");

const certifierId: string = crypto.randomUUID();

describe("CertificateService", () => {
  const validator = ValidatorService();
  const account = AccountService({ validator });
  const certificate = CertificateService({ account, validator, config: {} });

  test("isCertifier() return true if account is certifier", async () => {
    prisma.accounts.findUnique.mockResolvedValue(
      // @ts-expect-error assert
      { id: certifierId, roleValue: "certifier" },
    );
    const data = await certificate.isCertifier(certifierId);
    expect(data).toBe(true);
  });
});
