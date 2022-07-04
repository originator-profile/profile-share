import { test, expect, describe, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { AdminService } from "./admin";

const accountId: string = crypto.randomUUID();

describe("AdminService", () => {
  const prisma = mockDeep<PrismaClient>();

  afterEach(() => {
    mockClear(prisma);
  });

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

  test("create() calls prisma.admins.create()", async () => {
    prisma.admins.create.mockRejectedValue({});
    const admin: AdminService = AdminService({ prisma });
    const dummyPassword: string = crypto.randomUUID();
    await admin.create(accountId, dummyPassword);
    // @ts-expect-error assert
    expect(prisma.admins.create.calls[0][0].data.password).toMatch(
      /^\$2[ayb]\$.{56}$/
    );
  });
});
