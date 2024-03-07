import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import fetcher from "./fetcher";
import { useSession } from "./session";
import { Request } from "@originator-profile/model";
import { Prisma } from "@prisma/client";

type OpRequestBody = Omit<
  Prisma.requestsGetPayload<
    Prisma.requestsDefaultArgs & { include: { reviewComments: true } }
  >,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

/*
 * DBモデルからデータモデルへの変換
 * TODO: @originator-profile/registry-db に移して
 */
function convert(body: OpRequestBody): Request {
  return {
    ...body,
    requestSummary: body.requestSummary ?? undefined,
    reviewSummary: body.reviewSummary ?? undefined,
    status: body.statusValue as unknown as Request["status"],
  };
}

type FetchLatestRequestKey = {
  requestId: "latest";
  url: `/internal/accounts/${string}/requests/`;
  token: string;
};

type CreateRequestProps = {
  requestSummary: string;
};

async function fetchLatestRequest(
  req: FetchLatestRequestKey,
): Promise<Request | undefined> {
  const url: `/internal/accounts/${string}/latest/` = `${req.url}${req.requestId}/`;

  try {
    const res = await fetcher<OpRequestBody>({ ...req, url });
    return convert(res);
  } catch (e) {
    const res = (e as Error).cause as Response | undefined;
    if (res?.status === 404) return;
    // TODO: https://github.com/originator-profile/profile/issues/1028
    if (res?.status === 400) return;
  }
}

/**
 * 申請の作成
 */
async function createRequest(
  req: FetchLatestRequestKey & CreateRequestProps,
): Promise<Request> {
  const res = await fetcher<OpRequestBody>({
    method: "POST",
    url: req.url,
    token: req.token,
    body: JSON.stringify({ requestSummary: req.requestSummary }),
    headers: { "Content-Type": "application/json" },
  });

  return convert(res);
}

/**
 * 申請の取り下げ
 */
async function cancelRequest(req: FetchLatestRequestKey): Promise<void> {
  const url: `/internal/accounts/${string}/latest/` = `${req.url}${req.requestId}/`;
  await fetcher({ ...req, method: "DELETE", url });
}

/**
 * 申請情報へのアクセス
 */
export function useLatestRequest() {
  const session = useSession();
  const accessTokenOrNull = session.data?.accessToken ?? null;

  const key: FetchLatestRequestKey | null = accessTokenOrNull
    ? {
        requestId: "latest",
        url: `/internal/accounts/${session.data?.user?.accountId}/requests/`,
        token: accessTokenOrNull,
      }
    : null;

  const latestRequest = useSWR(key, fetchLatestRequest);

  const createRequestMutation = useSWRMutation(
    key,
    async (key, { arg }: { arg: CreateRequestProps }) => {
      return await createRequest({ ...key, ...arg });
    },
  );

  const cancelRequestMutation = useSWRMutation(key, cancelRequest);

  return Object.assign(latestRequest, {
    create: createRequestMutation.trigger,
    cancel: cancelRequestMutation.trigger,
  });
}
