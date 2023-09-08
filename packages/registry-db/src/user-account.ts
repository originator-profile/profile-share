import { Prisma, userAccounts } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "@originator-profile/registry-db";

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
    return data ?? new NotFoundError();
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
});

export type UserAccountRepository = ReturnType<typeof UserAccountRepository>;
