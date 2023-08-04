import { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(prisma);
});

export const prisma = mockDeep<PrismaClient>();

export const getClient = () => prisma;
export default prisma;
