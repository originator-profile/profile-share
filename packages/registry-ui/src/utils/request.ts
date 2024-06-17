import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import fetcher from "./fetcher";
import { useSession } from "./session";
import { Request } from "@originator-profile/model";

type FetchLatestRequestKey = {
  requestId: "latest";
  url: `/internal/accounts/${string}/requests/`;
  token: string;
};

type CreateRequestProps = {
  requestSummary: string;
};

type FetchLatestRequestListKey = {
  url: `/internal/requests/?pending=${boolean}`;
  token: string;
};

async function fetchLatestRequest(
  req: FetchLatestRequestKey,
): Promise<Request | undefined> {
  const url: `/internal/accounts/${string}/latest/` = `${req.url}${req.requestId}/`;

  try {
    const res = await fetcher<Request>({ ...req, url });
    return res;
  } catch (e) {
    const res = (e as Error).cause as Response | undefined;
    if (res?.status === 404) return;
  }
}

/**
 * 申請の作成
 */
async function createRequest(
  req: FetchLatestRequestKey & CreateRequestProps,
): Promise<Request> {
  const res = await fetcher<Request>({
    method: "POST",
    url: req.url,
    token: req.token,
    body: JSON.stringify({ requestSummary: req.requestSummary }),
    headers: { "Content-Type": "application/json" },
  });

  return res;
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

async function fetchLatestRequestList(
  req: FetchLatestRequestListKey,
): Promise<Request[] | undefined> {
  try {
    const res = await fetcher<Request[]>(req);
    return res;
  } catch (e) {
    const res = (e as Error).cause as Response | undefined;
    if (res?.status === 404) return;
  }
}

/**
 * 申請情報へのアクセス
 */
export function useLatestRequestList(pending: boolean) {
  const session = useSession();
  const accessTokenOrNull = session.data?.accessToken ?? null;

  const key: FetchLatestRequestListKey | null = accessTokenOrNull
    ? {
        url: `/internal/requests/?pending=${pending}`,
        token: accessTokenOrNull,
      }
    : null;

  const latestRequestList = useSWR(key, fetchLatestRequestList);

  return latestRequestList;
}
