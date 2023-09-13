import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";

/**
 * ユーザーアカウントを作成更新するカスタムフック
 */
export function useUserUpsert() {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  return useSWR<{
    id: string;
    name: string;
    email: string;
    picture: string;
    accountId: string;
  }>(
    token && { method: "PUT", url: "/internal/user-accounts/", token },
    fetcher,
  );
}
