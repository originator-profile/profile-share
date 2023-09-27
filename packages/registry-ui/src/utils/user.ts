import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { useAsync } from "react-use";
import fetcher from "./fetcher";

type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  accountId: string;
};

/**
 * ユーザーアカウントを取得するカスタムフック
 */
export function useUser(userAccountId: string | null) {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  return useSWR(
    token &&
      userAccountId && {
        url: `/internal/user-accounts/${userAccountId}/`,
        token,
      },
    fetcher<User>,
  );
}

/**
 * ユーザーアカウントを作成更新するカスタムフック
 */
export function useUserUpsert() {
  const { getAccessTokenSilently } = useAuth0();
  const { value: token = null } = useAsync(async () => {
    return getAccessTokenSilently();
  });

  return useSWR(
    token && { method: "PUT", url: "/internal/user-accounts/", token },
    fetcher<User>,
  );
}
