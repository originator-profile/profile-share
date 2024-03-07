import {
  parseExpirationDate,
  parseIssuanceDate,
} from "@originator-profile/core";

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
