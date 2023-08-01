import { PrismaClient } from "@prisma/client";
import transactionContext, { PRISMA_CLIENT_KEY } from "./transaction-context";

/**
 * prisma client のシングルトン
 */
export const prisma = new PrismaClient();

/**
 * prisma client を返す（トランザクション対応）。
 * @return prisma client
 */
export const getClient = () => {
  const tx = transactionContext.get(PRISMA_CLIENT_KEY);
  return tx ? tx : prisma;
};
