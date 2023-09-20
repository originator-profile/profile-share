import { Prisma, requests } from "@prisma/client";
import { getClient } from "@originator-profile/registry-db";
import { NotFoundError } from "http-errors-enhanced";

export const RequestRepository = () => ({
  /**
   * 申請情報の作成
   * @param author 申請担当者 ID
   * @param accountId 会員 ID
   * @return
   */
  async create(
    accountId: string,
    authorId: string,
    requestSummary: string,
  ): Promise<requests | Error> {
    const input: Prisma.requestsCreateInput = {
      author: {
        connect: { id: authorId },
      },
      group: {
        connect: { id: accountId },
      },
      requestSummary: requestSummary,
    };

    const prisma = getClient();
    return prisma.requests.create({ data: input }).catch((e: Error) => e);
  },

  /**
   * 最新の申請情報の取得
   * @param accountId 会員 ID
   * @return 取得した申請情報またはエラー
   */
  async read(accountId: string): Promise<requests | Error> {
    const prisma = getClient();
    const data = await prisma.requests
      .findFirst({
        where: { groupId: accountId },
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
      })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },
});

export type RequestRepository = ReturnType<typeof RequestRepository>;
