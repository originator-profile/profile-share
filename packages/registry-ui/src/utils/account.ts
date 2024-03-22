import useSWR from "swr";
import type { OpHolder } from "@originator-profile/model";
import omit from "just-omit";
import fetcher from "./fetcher";
import { useSession } from "./session";

export type OpCredential = {
  id: string;
  url?: string;
  image?: string;
  name: string;
  certifier: {
    id: string;
    name: string;
  };
  verifier: {
    id: string;
    name: string;
  };
  issuedAt: string;
  expiredAt: string;
};

export type OpAccountWithCredentials = Omit<OpHolder, "type" | "logos"> & {
  id: string;
  roleValue: string;
  credentials: Array<OpCredential>;
};

/**
 * アカウントを取得するカスタムフック
 */
export function useAccount(accountId: string | null) {
  const token = useSession().data?.accessToken ?? null;

  return useSWR(
    token && accountId && { url: `/internal/accounts/${accountId}/`, token },
    fetcher<OpAccountWithCredentials>,
  );
}

/**
 * アカウントを更新する API を呼び出す（OP ID の変更も可能）
 */
export async function updateAccount(
  data: OpAccountWithCredentials,
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
    body: JSON.stringify(omit(data, "credentials")),
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

/**
 * 組織の公開鍵を取得するカスタムフック
 */
export function useKeys(accountId: string | null) {
  const token = useSession().data?.accessToken ?? null;

  return useSWR(
    token && accountId && { url: `/account/${accountId}/keys`, token },
    fetcher<{ keys: unknown[] }>,
  );
}
