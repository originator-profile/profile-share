import * as cls from "cls-hooked";
import { Prisma } from "@prisma/client";

const transactionContext =
  cls.createNamespace<Record<"tx", Prisma.TransactionClient | undefined>>(
    "prisma transaction",
  );

export const PRISMA_CLIENT_KEY = "tx";

export default transactionContext;
