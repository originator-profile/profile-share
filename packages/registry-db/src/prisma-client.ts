import { PrismaClient, Prisma } from "@prisma/client";
import * as cls from "cls-hooked";

const PRISMA_CLIENT_KEY = "tx";

const transactionContext =
  cls.createNamespace<Record<"tx", Prisma.TransactionClient | undefined>>(
    "prisma transaction",
  );

export const prisma = new PrismaClient();

/**
 * prisma client を返す（トランザクション対応）。
 * @return prisma client
 */
export const getClient = () => {
  const tx = transactionContext.get(PRISMA_CLIENT_KEY);
  return tx ? tx : prisma;
};

/**
 * DBのトランザクションとして {fn} を実行する
 *
 * @param fn トランザクションとして実行したい処理
 * @return prisma client
 */
export const beginTransaction = async <T>(fn: () => T): Promise<T | Error> => {
  const savedTx = transactionContext.get(PRISMA_CLIENT_KEY);

  try {
    if (savedTx) {
      // この場合、既に $transaction() の中なので、再度 $transaction() を呼ぶことはせず、
      // fn() をそのまま実行する。
      return await fn();
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return transactionContext.runPromise(async () => {
        transactionContext.set(PRISMA_CLIENT_KEY, tx);
        return await fn();
      });
    });
  } catch (e) {
    return e as Error;
  }
};
