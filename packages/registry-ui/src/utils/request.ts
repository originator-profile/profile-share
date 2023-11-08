import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { SWRResponse } from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";
import { useUser } from "../utils/user";
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

type OpRequestSWRResponse = SWRResponse<OpRequestBody>;

type AccountId = string | null;

/*
 * DBモデルからデータモデルへの変換
 * TODO: @originator-profile/registry-db に移して
 */
function convert(body: OpRequestSWRResponse["data"]): Request | undefined {
  if (!body) return body;
  return {
    ...body,
    requestSummary: body.requestSummary ?? undefined,
    reviewSummary: body.reviewSummary ?? undefined,
    status: body.statusValue as unknown as Request["status"],
  };
}

/**
 * 最新の申請情報の取得
 */
export function useLatestRequest(accountId: AccountId) {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  const swr: OpRequestSWRResponse = useSWR(
    token &&
      accountId && {
        url: `/internal/accounts/${accountId}/requests/latest/`,
        token,
      },
    fetcher<OpRequestBody>,
  );

  return {
    ...swr,
    data: convert(swr.data),
  };
}

/**
 * 申請の作成
 */
async function createRequest(req: {
  token: string;
  accountId: AccountId;
  requestSummary: string;
}): Promise<OpRequestBody | Error> {
  return await fetcher<OpRequestBody>({
    method: "POST",
    body: JSON.stringify({ requestSummary: req.requestSummary }),
    headers: { "Content-Type": "application/json" },
    url: `/internal/accounts/${req.accountId}/requests/`,
    token: req.token,
  }).catch((e) => e);
}

/**
 * 申請を作成するハンドラー
 */
export function useCreateRequestHandler() {
  const { user: token, getAccessTokenSilently } = useAuth0();
  const { data: user } = useUser(token?.sub ?? null);
  const accountId = user?.accountId ?? null;
  const { mutate } = useLatestRequest(accountId);
  const handler = async () => {
    const token = await getAccessTokenSilently();
    // TODO: 失敗時の通知を実装して
    // TODO: 申請概要を入力するダイアログを実装して
    return createRequest({ token, accountId, requestSummary: "test" }).finally(
      () => mutate(),
    );
  };
  return handler;
}

/**
 * 申請の取り下げ
 */
async function deleteRequest(req: {
  token: string;
  accountId: AccountId;
}): Promise<void> {
  return await fetcher<OpRequestBody>({
    method: "DELETE",
    url: `/internal/accounts/${req.accountId}/requests/latest/`,
    token: req.token,
  }).catch((e) => e);
}

/**
 * 申請を取り下げるハンドラー
 */
export function useDeleteRequestHandler() {
  const { user: token, getAccessTokenSilently } = useAuth0();
  const { data: user } = useUser(token?.sub ?? null);
  const accountId = user?.accountId ?? null;
  const { mutate } = useLatestRequest(accountId);
  const handler = async () => {
    const token = await getAccessTokenSilently();
    // TODO: 失敗時の通知を実装して
    return deleteRequest({ token, accountId }).finally(() => mutate());
  };
  return handler;
}
