import { PrismaClient } from "@prisma/client";
import transactionLocalStorage from "./transaction-local-storage";

/**
 * prisma client のシングルトン
 */
export const prisma = new PrismaClient();

/**
 * prisma client を返す（トランザクション対応）。
 * @return prisma client
 */
export const getClient = () => {
  const tx = transactionLocalStorage.getStore();
  return tx ? tx : prisma;
};
