import type {
  OpRequest,
  OpRequestList,
  RequestRepository,
} from "@originator-profile/registry-db";

type Options = {
  requestRepository: RequestRepository;
};

export const RequestService = ({ requestRepository }: Options) => ({
  /** {@link RequestRepository.create} */
  async create(
    accountId: string,
    authorId: string,
    requestSummary: string,
  ): Promise<OpRequest> {
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
