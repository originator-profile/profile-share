import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";

/**
 * アカウントを取得するカスタムフック
 */
export function useAccount(accountId: string | null = null) {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  return useSWR<{ roleValue: string }>(
    token && accountId && { url: `/internal/accounts/${accountId}/`, token },
    fetcher,
  );
}
