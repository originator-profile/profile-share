import { PrismaClient } from "@prisma/client";
import { create, start } from "./server";

if (!("NODE_ENV" in process.env)) process.env.NODE_ENV = "production";
const isDev = process.env.NODE_ENV !== "production";

async function main() {
  const prisma = new PrismaClient();
  const server = create({ isDev, prisma });
  await start(server);
}

main();
