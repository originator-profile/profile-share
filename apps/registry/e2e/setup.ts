import "cross-fetch/polyfill";
import { beforeAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { waitForDb } from "../src/seed";

beforeAll(async () => {
  const prisma = new PrismaClient();
  await waitForDb(prisma);
});
