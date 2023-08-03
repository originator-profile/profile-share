import { Prisma } from "@prisma/client";
import { prisma } from "./prisma-client";
import transactionLocalStorage from "./transaction-local-storage";
import { BadRequestError } from "http-errors-enhanced";

/**
 * DBのトランザクションとして {fn} を実行する
 *
 * @param fn トランザクションとして実行したい処理
 * @return prisma client
 */
export const beginTransaction = async <T>(fn: () => T): Promise<T | Error> => {
  const savedTx = transactionLocalStorage.getStore();

  try {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      // このエラーの場合、 e.message にスタックトレースが含まれるため、ユーザーにそのまま見せないほうがよい。
      return new BadRequestError("transaction failed");
    }
    return e as Error;
  }
};
