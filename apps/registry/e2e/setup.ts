import "cross-fetch/polyfill";
import { beforeAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { waitForDb } from "@webdino/profile-registry-db/prisma/seed";

beforeAll(async () => {
  const prisma = new PrismaClient();
  await waitForDb(prisma);
});
