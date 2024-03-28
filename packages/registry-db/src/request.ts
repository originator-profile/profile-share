import { Prisma, requestLogs, requests } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { beginTransaction } from "./lib/transaction";
import { getClient } from "./lib/prisma-client";

type AccountId = requests["groupId"];

export type Request = requests & {
  reviewComments: Array<{
    id: number;
    requestFieldName: string;
    comment: string;
  }>;
};

export type RequestLog = requestLogs & {
  reviewComments?: Array<{
    id: number;
    requestFieldName: string;
    comment: string;
  }>;
};

export type RequestLogCreate = Omit<RequestLog, "id">;

export type RequestList = (requests & { accountName: string })[];

/**
 * 審査コメントの配列を受け取って、 prisma の update() や create() に渡せる形式にします。
 * @param reviewComments 審査コメントの配列
 * @return connectOrCreate プロパティに渡せる値
 */
const convertReviewCommentsToPrismaCreateMany = (
  reviewComments: RequestLog["reviewComments"],
):
  | Prisma.requestLogReviewCommentsCreateNestedManyWithoutRequestLogInput
  | undefined => {
  if (!reviewComments) {
    return undefined;
  }

  const reviewCommentsCreateMany = reviewComments?.map((rc) => {
    return {
      reviewCommentId: rc.id,
    };
  });
  return { createMany: { data: reviewCommentsCreateMany } };
};

export const RequestRepository = () => ({
  /**
   * 申請情報の作成
   * @param accountId 会員 ID
   * @param authorId 申請者 ID
   * @param requestSummary 申請の概要
   * @return 作成した申請情報
   */
  async create(
    accountId: AccountId,
    authorId: string,
    requestSummary: string,
  ): Promise<Request> {
    return await beginTransaction<Request>(async () => {
      const prisma = getClient();
      const request = await prisma.requests.upsert({
        where: { groupId: accountId },
        create: {
          group: { connect: { id: accountId } },
          author: { connect: { id: authorId } },
          requestSummary,
        },
        update: {
          group: { connect: { id: accountId } },
          author: { connect: { id: authorId } },
          status: { connect: { value: "pending" } },
          /* 新規の申請に際して同組織の既存申請に対する以下の情報は無効である */
          requestSummary,
          reviewSummary: null,
          reviewComments: {
            set: [],
          },
          reviewer: { disconnect: true },
          certifier: { disconnect: true },
          op: { disconnect: true },
        },
      });

      const { id: _, ...logData } = request;
      await this.log(logData);

      return { reviewComments: [], ...request };
    });
  },

  /**
   * 最新の申請情報の取得
   * @param accountId 会員 ID
   * @throws {NotFoundError} 最新の申請情報が見つからない
   * @return 申請情報
   */
  async read(accountId: AccountId): Promise<Request> {
    const prisma = getClient();
    const data = await prisma.requests.findUnique({
      where: { groupId: accountId },
      include: { reviewComments: true },
    });
    if (!data) throw new NotFoundError("OP Request not found.");

    return data;
  },

  /**
   * 申請情報の取り下げ
   * @param accountId 会員 ID
   * @throws {BadRequestError} 既に取り下げている
   * @throws {NotFoundError} 申請情報が見つからない/組織情報が見つからない
   * @return 取り下げ後の申請情報
   */
  async cancel(accountId: AccountId): Promise<Request> {
    return await beginTransaction<Request>(async () => {
      const prisma = getClient();
      const old = await prisma.requests.findUnique({
        where: { groupId: accountId },
      });
      if (!old) throw new NotFoundError("OP Request not found.");
      if (old.statusValue === "cancelled")
        throw new BadRequestError("Request already cancelled.");
      const updated = await prisma.requests
        .update({
          where: { groupId: accountId },
          data: { status: { connect: { value: "cancelled" } } },
        })
        .catch((e: Error) => e);
      if (
        updated instanceof Prisma.PrismaClientKnownRequestError &&
        updated.code === "P2025"
      ) {
        throw new NotFoundError("OP Request not found.");
      }

      if (updated instanceof Error) throw updated;

      const newest = await this.read(accountId);
      if (!newest) throw new NotFoundError("OP Account not found.");

      const { id: _, ...logData } = newest;
      await this.log(logData);

      return newest;
    });
  },

  /**
   * 申請情報ログの追加
   * @param requestLog 申請ログ
   * @return 作成したログ
   */
  async log(requestLog: RequestLogCreate): Promise<requestLogs> {
    const prisma = getClient();
    const { reviewComments, ...createInput } = requestLog;

    const input = {
      reviewComments: convertReviewCommentsToPrismaCreateMany(reviewComments),
      ...createInput,
    } as const satisfies Prisma.requestLogsCreateInput;

    return await prisma.requestLogs.create({
      data: input,
      include: { reviewComments: true },
    });
  },

  /**
   * 最新の申請情報リストの取得
   * @param options オプション
   * @return 取得した申請情報
   */
  async readList({
    pending,
  }: {
    /** 審査待ちかどうか (undefined: すべての申請情報, true: pending, false: pending以外) */
    pending?: boolean;
  }): Promise<RequestList> {
    const prisma = getClient();
    const data = await prisma.requests.findMany({
      where:
        pending === undefined
          ? undefined
          : {
              status: {
                [pending ? "is" : "isNot"]: {
                  value: "pending",
                },
              },
            },
      include: {
        group: {
          select: {
            name: true,
          },
        },
      },
    });
    return data.map((request) => {
      const { group, ...rest } = request;
      return {
        ...rest,
        accountName: group.name,
      };
    });
  },

  /**
   * 審査結果である申請情報のリストの取得
   * @param accountId 会員 ID
   * @return 審査結果である申請情報のリスト
   */
  async readResults(accountId: AccountId): Promise<RequestLog[]> {
    const prisma = getClient();
    const data = await prisma.requestLogs.findMany({
      where: { groupId: accountId, status: { NOT: { value: "pending" } } },
      include: { reviewComments: { include: { reviewComment: true } } },
    });
    return data.map((requestLog) => {
      const { reviewComments, ...rest } = requestLog;
      return {
        ...rest,
        reviewComments: reviewComments.map((rc) => {
          return {
            id: rc.reviewComment.id,
            requestFieldName: rc.reviewComment.requestFieldName,
            comment: rc.reviewComment.comment,
          };
        }),
      };
    });
  },
});

export type RequestRepository = ReturnType<typeof RequestRepository>;
