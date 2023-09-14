import { Prisma, userAccounts } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { UserAccountRepository } from "@originator-profile/registry-db";
import crypto from "node:crypto";

type Options = {
  userAccountRepository: UserAccountRepository;
};

export const UserAccountService = ({ userAccountRepository }: Options) => ({
  /**
   * ユーザーアカウントの取得
   * @param input.id ユーザーアカウントID
   * @return ユーザーアカウント
   */
  async read(input: Pick<userAccounts, "id">): Promise<userAccounts | Error> {
    return await userAccountRepository.read(input);
  },
  /**
   * ユーザーアカウントの更新・作成
   * @param input ユーザーアカウント
   * @return ユーザーアカウント
   * @remarks
   * ユーザーアカウント作成時、同時に仮の会員を作成します。
   * 少なくとも会員のドメイン名は、OP発行前に正式なものに変更する必要があることに注意してください。
   */
  async upsert(
    input: Omit<
      Prisma.userAccountsUpdateInput & Prisma.userAccountsCreateInput,
      "account"
    >,
  ): Promise<userAccounts | Error> {
    const found = await userAccountRepository.read(input);
    if (found instanceof NotFoundError) {
      return await userAccountRepository.create({
        ...input,
        account: {
          create: {
            role: { connect: { value: "group" } },
            domainName: `${crypto.randomUUID()}.example.com`,
            name: "",
            postalCode: "",
            addressCountry: "",
            addressLocality: "",
            streetAddress: "",
            addressRegion: "",
          },
        },
      });
    } else {
      return await userAccountRepository.update(input);
    }
  },
});
