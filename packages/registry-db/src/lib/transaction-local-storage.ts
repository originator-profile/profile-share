import { Prisma } from "@prisma/client";
import { AsyncLocalStorage } from 'node:async_hooks';

export const transactionLocalStorage = new AsyncLocalStorage<Prisma.TransactionClient>();

export default transactionLocalStorage;
