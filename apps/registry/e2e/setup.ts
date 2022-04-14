import "cross-fetch/polyfill";
import { beforeAll } from "vitest";
import util from "node:util";
import { PrismaClient } from "@prisma/client";

const sleep = util.promisify(setTimeout);

async function waitForDb(prisma: PrismaClient): Promise<void> {
  try {
    await prisma.$connect();
  } catch {
    console.log("Waiting for database to be ready...");
    await sleep(1_000);
    return waitForDb(prisma);
  }
}

beforeAll(async () => {
  const prisma = new PrismaClient();
  await waitForDb(prisma);
});
