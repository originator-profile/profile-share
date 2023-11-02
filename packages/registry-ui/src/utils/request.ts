import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { SWRResponse } from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";
import { Request } from "@originator-profile/model";
import { Prisma } from "@prisma/client";

type Body = Omit<
  Prisma.requestsGetPayload<
    Prisma.requestsDefaultArgs & { include: { reviewComments: true } }
  >,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

type RequestSWRResponse = SWRResponse<Body>;

/*
 * DBモデルからデータモデルへの変換
 * TODO: @originator-profile/registry-db に移して
 */
function convert(body: RequestSWRResponse["data"]): Request | undefined {
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
export function useLatestRequest(accountId: string | null) {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  const swr: RequestSWRResponse = useSWR(
    token &&
      accountId && {
        url: `/internal/accounts/${accountId}/requests/latest/`,
        token,
      },
    fetcher<Body>,
  );

  return {
    ...swr,
    data: convert(swr.data),
  };
}
