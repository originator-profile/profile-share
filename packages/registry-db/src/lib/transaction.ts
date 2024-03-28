import { Prisma } from "@prisma/client";
import { prisma } from "./prisma-client";
import transactionLocalStorage from "./transaction-local-storage";

/**
 * DBのトランザクションとして {fn} を実行する
 *
 * @param fn トランザクションとして実行したい処理
 * @return prisma client
 */
export const beginTransaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  const savedTx = transactionLocalStorage.getStore();

  if (savedTx) {
    // この場合、既に $transaction() の中なので、再度 $transaction() を呼ぶことはせず、
    // fn() をそのまま実行する。
    return await fn();
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    return await transactionLocalStorage.run(tx, () => {
      return fn();
    });
  });
};
