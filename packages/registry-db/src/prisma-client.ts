import { PrismaClient, Prisma } from "@prisma/client";
import * as cls from "cls-hooked";

const PRISMA_CLIENT_KEY = "tx";

const transactionContext =
  cls.createNamespace<Record<"tx", Prisma.TransactionClient | undefined>>(
    "prisma transaction",
  );

export const prisma = new PrismaClient();

export const getClient = () => {
  const tx = transactionContext.get(PRISMA_CLIENT_KEY);
  return tx ? tx : prisma;
};

export const beginTransaction = async <T>(fn: () => T) => {
  const savedTx = transactionContext.get(PRISMA_CLIENT_KEY);

  if (savedTx) {
    return await fn();
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    return transactionContext.runPromise(async () => {
      transactionContext.set(PRISMA_CLIENT_KEY, tx);
      return await fn();
    });
  });
};
