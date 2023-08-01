import { test, expect, describe, vi } from "vitest";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { AdminService } from "./admin";

import { prisma } from "@originator-profile/registry-db/src/__mocks__/prisma-client";

vi.mock("@originator-profile/registry-db/src/prisma-client.ts");


const accountId: string = crypto.randomUUID();

describe("AdminService", () => {
  test("auth() verify password", async () => {
    const dummyPassword: string = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(dummyPassword, 4);
    prisma.admins.findUniqueOrThrow.mockResolvedValue({
      adminId: accountId,
      password: hashedPassword,
    });
    const admin: AdminService = AdminService({ prisma });
    const valid = await admin.auth(accountId, dummyPassword);
    expect(valid).toBe(true);
  });
});
