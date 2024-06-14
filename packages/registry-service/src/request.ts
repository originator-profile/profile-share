import type {
  OpRequest,
  OpRequestList,
  RequestRepository,
  UserAccountRepository,
} from "@originator-profile/registry-db";
import { sendNotifyMail } from "./utils/mail-notify";
import { logger } from "./utils/logger";

type Options = {
  requestRepository: RequestRepository;
  userAccountRepository: UserAccountRepository;
};

export const RequestService = ({
  requestRepository,
  userAccountRepository,
}: Options) => ({
  /** {@link RequestRepository.create} */
  async create(
    accountId: string,
    authorId: string,
    requestSummary: string,
  ): Promise<OpRequest> {
    /* 通知については await しないので、ハンドリングをここで完結させること */
    userAccountRepository
      .getReviewerCandidates()
      .then((reviewers) => {
        return reviewers.length > 0
          ? sendNotifyMail({
              recipients: reviewers.map((r) => r.email),
              subject: "OP発行申請がありました",
              body: "<html><body>OP発行申請がありました。OP登録サイトを確認してください。</body></html>",
            })
          : undefined;
      })
      .then((info) => {
        if (info) {
          logger.info(JSON.stringify(info));
        } else {
          logger.warn("There's no reviewers to be notified.");
        }
      })
      .catch((err) => {
        logger.error(err);
      });
    return await requestRepository.create(accountId, authorId, requestSummary);
  },
  /** {@link RequestRepository.read} */
  async read(accountId: string): Promise<OpRequest> {
    return await requestRepository.read(accountId);
  },
  /** {@link RequestRepository.cancel} */
  async cancel(accountId: string): Promise<OpRequest> {
    return await requestRepository.cancel(accountId);
  },
  /** {@link RequestRepository.readList} */
  async readList({ pending }: { pending?: boolean }): Promise<OpRequestList> {
    return await requestRepository.readList({ pending });
  },
  /** {@link RequestRepository.readResults} */
  async readResults(accountId: string): Promise<OpRequestList> {
    return await requestRepository.readResults(accountId);
  },
});

export type RequestService = ReturnType<typeof RequestService>;
