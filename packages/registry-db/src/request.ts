import { OpHolder, Request as OpModelRequest } from "@originator-profile/model";
import { Prisma, requests } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { getClient } from "./lib/prisma-client";
import { beginTransaction } from "./lib/transaction";
import { MakeOptional, NullableKeysType } from "@originator-profile/core";

type GroupId = requests["groupId"];

const requestLogsExtArgs = {
  include: {
    request: {
      include: {
        group: {
          include: {
            businessCategories: true,
          },
        },
      },
    },
    reviewComments: true,
  },
} as const;

type RequestLogs = Prisma.requestLogsGetPayload<typeof requestLogsExtArgs>;

type OpRequestWithoutDate = Omit<
  OpModelRequest,
  "createdAt" | "updatedAt" | "group"
> & {
  request: {
    group: NullableKeysType<
      Omit<MakeOptional<OpHolder, "url">, "type" | "logos">
    > & { id: string };
  };
  requestId: number;
  authorId: string;
};

export type OpRequest = OpRequestWithoutDate & {
  createdAt: Date;
  updatedAt: Date;
};

export type OpRequestList = Array<OpRequest>;

function convertPrismaRequestToOpRequest(
  body: RequestLogs,
): OpRequestWithoutDate {
  return {
    ...body,
    request: {
      group: {
        ...body.request.group,
        businessCategory: body.request.group.businessCategories.map(
          (bc) => bc.businessCategoryValue,
        ),
      },
    },
    requestSummary: body.requestSummary ?? undefined,
    reviewSummary: body.reviewSummary ?? undefined,
    status: body.statusValue as unknown as OpRequest["status"],
  };
}

export const RequestRepository = () => ({
  /**
   * 申請情報の作成
   * @param groupId 会員 ID
   * @param authorId 申請者 ID
   * @param requestSummary 申請の概要
   * @return 作成した申請情報
   */
  async create(
    groupId: GroupId,
    authorId: string,
    requestSummary: string,
  ): Promise<OpRequest> {
    const prisma = getClient();

    return await beginTransaction<OpRequest>(async () => {
      const old = await this.read(groupId).catch((e: NotFoundError) => e);

      const requestId: number =
        typeof old.requestId === "number"
          ? old.requestId
          : await prisma.requests
              .create({
                data: {
                  groupId,
                },
              })
              .then((r) => r.id);

      const data = await prisma.requestLogs.create({
        ...requestLogsExtArgs,
        data: {
          requestId,
          authorId,
          requestSummary,
        },
      });

      return {
        ...convertPrismaRequestToOpRequest(data),
        createdAt: data.insertedAt,
        updatedAt: data.insertedAt,
      };
    });
  },

  /**
   * 最新の申請情報の取得
   * @param groupId 会員 ID
   * @throws {NotFoundError} 最新の申請情報が見つからない
   * @return 申請情報
   */
  async read(groupId: GroupId): Promise<OpRequest> {
    const prisma = getClient();
    const data = await prisma.requestLogs.findFirst({
      ...requestLogsExtArgs,
      where: {
        request: {
          groupId,
        },
      },
      orderBy: {
        insertedAt: "desc",
      },
    });

    if (!data) throw new NotFoundError("OP Request not found.");

    const {
      _min: { insertedAt: createdAt },
      _max: { insertedAt: updatedAt },
    } = await prisma.requestLogs.aggregate({
      where: {
        requestId: data.requestId,
      },
      _min: { insertedAt: true },
      _max: { insertedAt: true },
    });

    return {
      ...convertPrismaRequestToOpRequest(data),
      createdAt: createdAt as Date,
      updatedAt: updatedAt as Date,
    };
  },

  /**
   * 申請情報の取り下げ
   * @param groupId 会員 ID
   * @throws {BadRequestError} 既に取り下げている
   * @throws {NotFoundError} 申請情報が見つからない/組織情報が見つからない
   * @return 取り下げ後の申請情報
   */
  async cancel(groupId: GroupId): Promise<OpRequest> {
    const prisma = getClient();

    return await beginTransaction<OpRequest>(async () => {
      const old = await this.read(groupId);

      if (old.status === "cancelled") {
        throw new BadRequestError("Request already cancelled.");
      }

      const data = await prisma.requestLogs.create({
        ...requestLogsExtArgs,
        data: {
          statusValue: "cancelled",
          requestId: old.requestId,
          authorId: old.authorId,
        },
      });

      return {
        ...convertPrismaRequestToOpRequest(data),
        createdAt: data.insertedAt,
        updatedAt: data.insertedAt,
      };
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
  }): Promise<OpRequestList> {
    const prisma = getClient();

    const data = await prisma.requests.findMany({
      include: {
        requestLogs: {
          ...requestLogsExtArgs,
          take: 1,
          orderBy: {
            insertedAt: "desc",
          },
        },
      },
    });

    /* pending === true の場合はそのrequestLogs.insertedAtをcreatedAtとして使用するので収集不要 */
    const createdAt =
      pending === true
        ? []
        : await prisma.requestLogs.groupBy({
            by: ["requestId", "statusValue"],
            where: {
              statusValue: "pending",
            },
            _max: { insertedAt: true },
          });

    return data.flatMap((r) =>
      r.requestLogs
        .filter(
          (rl) =>
            typeof pending === "undefined" ||
            pending === (rl.statusValue === "pending"),
        )
        .map((rl) => {
          return {
            ...convertPrismaRequestToOpRequest(rl),
            createdAt:
              createdAt.find((c) => c.requestId === rl.requestId)?._max
                .insertedAt ?? rl.insertedAt,
            updatedAt: rl.insertedAt,
          };
        }),
    );
  },

  /**
   * 審査結果である申請情報のリストの取得
   * @param groupId 会員 ID
   * @return 審査結果である申請情報のリスト
   */
  async readResults(groupId: GroupId): Promise<OpRequestList> {
    const prisma = getClient();
    const { requestId, createdAt, updatedAt } = await this.read(groupId);

    const data = await prisma.requestLogs.findMany({
      ...requestLogsExtArgs,
      where: {
        statusValue: {
          not: "pending",
        },
        requestId,
      },
      orderBy: {
        insertedAt: "asc",
      },
    });

    return data.map(convertPrismaRequestToOpRequest).map((r) => ({
      ...r,
      createdAt,
      updatedAt,
    }));
  },
});

export type RequestRepository = ReturnType<typeof RequestRepository>;
