import { requests } from "@prisma/client";
import { type RequestRepository } from "@originator-profile/registry-db";

type Options = {
  requestRepository: RequestRepository;
};

export const RequestService = ({ requestRepository }: Options) => ({
  /**
   * 申請情報の作成
   * @param accountId 会員 ID
   * @param authorId 申請者 ID
   * @param requestSummary 申請概要
   * @return
   */
  async create(
    accountId: string,
    authorId: string,
    requestSummary: string,
  ): Promise<requests | Error> {
    return requestRepository.create(accountId, authorId, requestSummary);
  },
  /**
   * 最新の申請情報の取得
   * @param accountId 会員 ID
   * @return 最新の申請情報またはエラー
   */
  async read(accountId: string): Promise<requests | Error> {
    return requestRepository.read(accountId);
  },
});

export type RequestService = ReturnType<typeof RequestService>;
