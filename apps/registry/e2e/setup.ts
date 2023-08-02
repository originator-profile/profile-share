import "cross-fetch/polyfill";
import { beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { waitForDb } from "../src/seed";
import { AdminCreate } from "../src/commands/admin/create";
import { AdminDelete } from "../src/commands/admin/delete";

const ADMIN_ACCOUNT = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
const ADMIN_PASSWORD = "bdf70f3d38c1311fa06a211a2205623a";

beforeAll(async () => {
  const prisma = new PrismaClient();
  await waitForDb(prisma);

  try {
    // テスト用の管理者アカウントを作成
    await AdminCreate.run([
      `--id=${ADMIN_ACCOUNT}`,
      `--password=${ADMIN_PASSWORD}`,
    ]);
  } catch (e) {
    return;
  }
});

afterAll(async () => {
  // テスト用の管理者アカウントを削除
  await AdminDelete.run([`--id=${ADMIN_ACCOUNT}`]);
});
