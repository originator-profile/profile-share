import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";
import { type OpHolder } from "@originator-profile/model";

/**
 * アカウントを取得するカスタムフック
 */
export function useAccount(accountId: string | null) {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  return useSWR(
    token && accountId && { url: `/internal/accounts/${accountId}/`, token },
    fetcher<
      Omit<OpHolder, "type" | "logos"> & { id: string; roleValue: string }
    >,
  );
}
