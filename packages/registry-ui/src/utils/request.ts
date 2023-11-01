import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";
import { Request } from "@originator-profile/model";

/**
 * 最新の申請情報の取得
 */
export function useLatestRequest(accountId: string | null) {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  return useSWR(
    token &&
      accountId && {
        url: `/internal/accounts/${accountId}/requests/latest/`,
        token,
      },
    fetcher<Request>,
  );
}
