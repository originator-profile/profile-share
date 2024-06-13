import {
  parseExpirationDate,
  parseIssuanceDate,
} from "@originator-profile/core";
import { useSession } from "./session";
import useSWR from "swr";
import fetcher from "./fetcher";
import { OpCredential } from "./account";

export interface FormData {
  name: string;
  certifier: string;
  verifier: string;
  issuedAt: string;
  expiredAt: string;
}

/**
 * アカウントの資格情報を追加する API を呼び出す
 */
export async function createCredential(
  data: FormData,
  accountId: string,
  token: string,
) {
  const body = {
    ...data,
    expiredAt: parseExpirationDate(data.expiredAt).toISOString(),
    issuedAt: parseIssuanceDate(data.issuedAt).toISOString(),
  };

  const endpoint = `/internal/accounts/${accountId}/credentials`;
  return await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/**
 * アカウントの資格情報を更新する API を呼び出す
 */
export async function updateCredential(
  data: Partial<FormData>,
  accountId: string,
  credentialId: string,
  token: string,
) {
  const body = {
    certifier: data.certifier,
    verifier: data.verifier,
    name: data.name,
    issuedAt: data?.issuedAt && parseIssuanceDate(data.issuedAt).toISOString(),
    expiredAt:
      data?.expiredAt && parseExpirationDate(data.expiredAt).toISOString(),
  };

  const endpoint = `/internal/accounts/${accountId}/credentials/${credentialId}`;
  return await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/**
 * アカウントの資格情報を削除する API を呼び出す
 */
export async function deleteCredential(
  accountId: string,
  credentialId: string,
  token: string,
) {
  const endpoint = `/internal/accounts/${accountId}/credentials/${credentialId}`;
  return await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

type FetchCredentialsKey = {
  requestId: "latest";
  url: `/internal/accounts/${string}/credentials/`;
  token: string;
};

async function fetchCredentials(
  req: FetchCredentialsKey,
): Promise<OpCredential[] | undefined> {
  try {
    const res = await fetcher<OpCredential[]>(req);
    return res;
  } catch (e) {
    const res = (e as Error).cause as Response | undefined;
    if (res?.status === 404) return;
  }
}

/**
 * 資格情報へのアクセス
 * @param accountId ユーザーの所属組織以外の資格情報を取得する場合に指定
 */
export function useCredentials(accountId?: string) {
  const session = useSession();
  const accessTokenOrNull = session.data?.accessToken ?? null;

  const id = accountId ?? session.data?.user?.accountId;

  const key: FetchCredentialsKey | null = accessTokenOrNull
    ? {
        requestId: "latest",
        url: `/internal/accounts/${id}/credentials/`,
        token: accessTokenOrNull,
      }
    : null;

  const credentials = useSWR(key, fetchCredentials);

  return credentials;
}
