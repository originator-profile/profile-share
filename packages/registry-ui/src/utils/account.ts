import useSWR from "swr";
import type { OpHolder } from "@originator-profile/model";
import fetcher from "./fetcher";
import { useSession } from "./session";

/**
 * アカウントを取得するカスタムフック
 */
export function useAccount(accountId: string | null) {
  const token = useSession().data?.accessToken ?? null;

  return useSWR(
    token && accountId && { url: `/internal/accounts/${accountId}/`, token },
    fetcher<
      Omit<OpHolder, "type" | "logos"> & { id: string; roleValue: string }
    >,
  );
}

/**
 * アカウントを更新する API を呼び出す（OP ID の変更も可能）
 */
export async function updateAccount(
  data: unknown,
  accountId: string,
  token: string,
) {
  const endpoint = `/internal/accounts/${accountId}/`;
  return await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * 組織のロゴを取得するカスタムフック
 */
export function useAccountLogo(accountId: string | null) {
  const token = useSession().data?.accessToken ?? null;

  return useSWR(
    token &&
      accountId && { url: `/internal/accounts/${accountId}/logos/`, token },
    fetcher<{ url: string }>,
  );
}
