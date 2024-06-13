import useSWR from "swr";
import { useSession } from "./session";
import fetcher from "./fetcher";

type UserAccount = {
  accountId: string;
  email: string;
  id: string;
  name: string;
  picture: string;
};

/**
 * ユーザーアカウントを取得するカスタムフック
 */
export function useUserAccount(userId?: string | null) {
  const token = useSession().data?.accessToken ?? null;

  return useSWR(
    token && userId && { url: `/internal/user-accounts/${userId}/`, token },
    fetcher<UserAccount>,
  );
}
