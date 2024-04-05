import { Prisma } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "./lib/prisma-client";
import { User } from "@originator-profile/model";

type UserAccountId = User["id"];

export type UserWithOpAccountId = User & {
  accountId: string;
};

export const UserAccountRepository = () => ({
  /**
   * ユーザーアカウントの作成
   * @param input ユーザーアカウント
   * @return ユーザーアカウント
   */
  async create(
    input: Prisma.userAccountsCreateInput,
  ): Promise<UserWithOpAccountId> {
    const prisma = getClient();
    return await prisma.userAccounts.create({ data: input });
  },
  /**
   * ユーザーアカウントの表示
   * @param input.id ユーザーアカウント ID
   * @throws {NotFoundError} ユーザーが見つからない
   * @return ユーザーアカウント
   */
  async read({ id }: { id: UserAccountId }): Promise<UserWithOpAccountId> {
    const prisma = getClient();
    const data = await prisma.userAccounts.findUnique({ where: { id } });
    if (!data) throw new NotFoundError("User not found.");

    return data;
  },
  /**
   * ユーザーアカウントの更新
   * @param input ユーザーアカウント
   * @return ユーザーアカウント
   */
  async update({
    id,
    ...input
  }: Prisma.userAccountsUpdateInput & {
    id: UserAccountId;
  }): Promise<UserWithOpAccountId> {
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
  async delete({ id }: { id: UserAccountId }): Promise<UserWithOpAccountId> {
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
