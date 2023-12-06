import { Prisma, userAccounts } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "./lib/prisma-client";

type UserAccountId = userAccounts["id"];

export const UserAccountRepository = () => ({
  /**
   * ユーザーアカウントの作成
   * @param input ユーザーアカウント
   * @return ユーザーアカウント
   */
  async create(
    input: Prisma.userAccountsCreateInput,
  ): Promise<userAccounts | Error> {
    const prisma = getClient();
    return await prisma.userAccounts
      .create({ data: input })
      .catch((e: Error) => e);
  },
  /**
   * ユーザーアカウントの表示
   * @param input.id ユーザーアカウント ID
   * @return ユーザーアカウント
   */
  async read({ id }: { id: UserAccountId }): Promise<userAccounts | Error> {
    const prisma = getClient();
    const data = await prisma.userAccounts
      .findUnique({ where: { id } })
      .catch((e: Error) => e);
    return data ?? new NotFoundError("User not found.");
  },
  /**
   * ユーザーアカウントの更新
   * @param input ユーザーアカウント
   * @return ユーザーアカウント
   */
  async update({
    id,
    ...input
  }: Prisma.userAccountsUpdateInput & { id: UserAccountId }): Promise<
    userAccounts | Error
  > {
    const prisma = getClient();
    return await prisma.userAccounts.update({
      where: { id },
      data: input,
    });
  },
  /**
   * ユーザーアカウントの削除
   * @param input.id ユーザーアカウント ID
   * @return ユーザーアカウント
   */
  async delete({ id }: { id: UserAccountId }): Promise<userAccounts | Error> {
    const prisma = getClient();
    return await prisma.userAccounts.delete({
      where: { id },
    });
  },
  /**
   * 審査担当者かどうか
   * @throws {NotFoundError} 審査担当者ではない
   */
  async reviewerMembershipOrThrow(input: {
    id: UserAccountId;
    reviewerId: UserAccountId;
  }): Promise<void> {
    const prisma = getClient();
    const user = await prisma.userAccounts.count({
      where: {
        id: input.id,
        OR: [
          { requests: { some: { reviewerId: input.reviewerId } } },
          { requestLogs: { some: { reviewerId: input.reviewerId } } },
        ],
      },
    });
    if (user === 0) throw new NotFoundError("User not found.");
  },
});

export type UserAccountRepository = ReturnType<typeof UserAccountRepository>;
