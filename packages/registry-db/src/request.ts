import { Prisma, requestLogs, requests } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { beginTransaction } from "./lib/transaction";
import { getClient } from "./lib/prisma-client";
import { Request as OpModelRequest } from "@originator-profile/model";

type AccountId = requests["groupId"];
export type Request = Prisma.requestsGetPayload<{
  include: { reviewComments: true };
}>;

export type RequestLog = requestLogs & {
  reviewComments?: Array<{
    id: number;
    requestFieldName: string;
    comment: string;
  }>;
};

export type OpRequest = Omit<OpModelRequest, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

export type RequestLogCreate = Omit<RequestLog, "id">;

export type RequestList = (requests & { accountName: string })[];

export function convertToModel(body: Request): OpRequest {
  return {
    ...body,
    requestSummary: body.requestSummary ?? undefined,
    reviewSummary: body.reviewSummary ?? undefined,
    status: body.statusValue as unknown as OpRequest["status"],
  };
}

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
   * @return 作成した申請情報またはエラー
   */
  async create(
    accountId: AccountId,
    authorId: string,
    requestSummary: string,
  ): Promise<Request | Error> {
    return await beginTransaction<ReturnType<typeof this.create>>(async () => {
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
      if (request instanceof Error) throw request;
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { id: _, ...logData } = request;
      const requestLog = await this.log(logData);
      if (requestLog instanceof Error) throw requestLog;
      return { reviewComments: [], ...request };
    }).catch((e: Error) => e);
  },

  /**
   * 最新の申請情報の取得
   * @param accountId 会員 ID
   * @return 取得した申請情報またはエラー
   */
  async read(accountId: AccountId): Promise<Request | Error> {
    const prisma = getClient();
    const data = await prisma.requests
      .findUnique({
        where: { groupId: accountId },
        include: { reviewComments: true },
      })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },

  /**
   * 申請情報の取り下げ
   * @param accountId 会員 ID
   * @return 取り下げ後の申請情報またはエラー
   */
  async cancel(accountId: AccountId): Promise<Request | Error> {
    return await beginTransaction<ReturnType<typeof this.read>>(async () => {
      const prisma = getClient();
      const old = await prisma.requests
        .findUnique({
          where: { groupId: accountId },
        })
        .catch((e: Error) => e);
      if (old instanceof Error) throw old;
      if (!old) throw new NotFoundError();
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
      )
        throw new NotFoundError();
      if (updated instanceof Error) throw updated;
      const newest = await this.read(accountId);
      if (newest instanceof Error) throw newest;
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { id: _, ...logData } = newest;
      const requestLog = await this.log(logData);
      if (requestLog instanceof Error) throw requestLog;
      return newest;
    }).catch((e: Error) => e);
  },

  /**
   * 申請情報ログの追加
   * @param requestLog 申請ログ
   * @return 作成したログ
   */
  async log(requestLog: RequestLogCreate): Promise<requestLogs | Error> {
    const prisma = getClient();
    const { reviewComments, ...createInput } = requestLog;

    const input = {
      reviewComments: convertReviewCommentsToPrismaCreateMany(reviewComments),
      ...createInput,
    } as const satisfies Prisma.requestLogsCreateInput;

    return prisma.requestLogs
      .create({ data: input, include: { reviewComments: true } })
      .catch((e: Error) => e);
  },

  /**
   * 最新の申請情報リストの取得
   * @param options オプション
   * @return 取得した申請情報またはエラー
   */
  async readList({
    pending,
  }: {
    /** 審査待ちかどうか (undefined: すべての申請情報, true: pending, false: pending以外) */
    pending?: boolean;
  }): Promise<RequestList | Error> {
    const prisma = getClient();
    const data = await prisma.requests
      .findMany({
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
      })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;
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
   * @return 審査結果である申請情報のリストまたはエラー
   */
  async readResults(accountId: AccountId): Promise<RequestLog[] | Error> {
    const prisma = getClient();
    const data = await prisma.requestLogs
      .findMany({
        where: { groupId: accountId, status: { NOT: { value: "pending" } } },
        include: { reviewComments: { include: { reviewComment: true } } },
      })
      .catch((e: Error) => e);
    if (data instanceof Error) return data;
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
