import {
  type Request,
  type RequestRepository,
} from "@originator-profile/registry-db";

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
  ): Promise<Request | Error> {
    return await requestRepository.create(accountId, authorId, requestSummary);
  },
  /**
   * 最新の申請情報の取得
   * @param accountId 会員 ID
   * @return 最新の申請情報またはエラー
   */
  async read(accountId: string): Promise<Request | Error> {
    return requestRepository.read(accountId);
  },
  /**
   * 最新の申請情報の取り下げ
   * @param accountId 会員 ID
   * @return 取り下げ後の申請情報またはエラー
   */
  async cancel(accountId: string): Promise<Request | Error> {
    return requestRepository.cancel(accountId);
  },
});

export type RequestService = ReturnType<typeof RequestService>;
