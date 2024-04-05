import { Prisma } from "@prisma/client";
import {
  ForbiddenError,
  NotFoundError,
  isHttpError,
} from "http-errors-enhanced";
import {
  UserAccountRepository,
  UserWithOpAccountId,
} from "@originator-profile/registry-db";
import crypto from "node:crypto";
import { User } from "@originator-profile/model";

type Options = {
  userAccountRepository: UserAccountRepository;
};

export const UserAccountService = ({ userAccountRepository }: Options) => ({
  /**
   * ユーザーアカウントの取得
   * @param requestUser ログインしているユーザー
   * @param targetUser 対象のユーザー
   * @throws {NotFoundError} ユーザーが見つからない (グローマー拒否)
   * @throws {ForbiddenError} 対象のユーザーがまだ登録されていない
   * @return ユーザーアカウント
   */
  async read(
    requestUser: Pick<User, "id">,
    targetUser: Pick<User, "id">,
  ): Promise<UserWithOpAccountId> {
    if (requestUser.id !== targetUser.id) {
      await this.reviewerMembershipOrThrow({
        id: requestUser.id,
        reviewerId: targetUser.id,
      });
    }

    const data = await userAccountRepository.read(targetUser);

    if (!data) {
      throw new ForbiddenError("User activation is required.");
    }

    const { id, name, picture, accountId } = data;
    return { id, name, picture, accountId };
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
  ): Promise<UserWithOpAccountId> {
    const found = await userAccountRepository
      .read(input)
      .catch((e: NotFoundError) => e);
    if (isHttpError(found) && found.status === 404) {
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
  /**
   * 審査担当者かどうか
   * @throws {NotFoundError} 審査担当者ではない
   */
  async reviewerMembershipOrThrow(input: {
    /** ユーザーID */
    id: string;
    /** 審査担当者ID */
    reviewerId: string;
  }): Promise<void> {
    await userAccountRepository.reviewerMembershipOrThrow(input);
  },
  /**
   * ログインしているユーザーが登録されているかどうか
   * @param requestUser ログインしているユーザー
   * @throws {ForbiddenError} まだ登録されていない
   */
  async signedUpOrThrow(requestUser: Pick<User, "id">): Promise<void> {
    await this.read(requestUser, requestUser);
  },
  /**
   * ユーザーの所属組織かどうか
   * @param requestUser ログインしているユーザー
   * @param targetGroup 対象の組織
   * @throws {NotFoundError} ユーザーが見つからない (グローマー拒否)
   * @throws {ForbiddenError} まだ登録されていない
   */
  async isMemberOfOrThrow(
    requestUser: Pick<User, "id">,
    targetGroup: { id: string },
  ): Promise<void> {
    const user = await this.read(requestUser, requestUser);

    if (user.accountId !== targetGroup.id) {
      throw new NotFoundError("Group not found.");
    }
  },
});
