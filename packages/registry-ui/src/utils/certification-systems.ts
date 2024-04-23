import useSWR from "swr";
import { CertificationSystem } from "@originator-profile/model";
import fetcher from "./fetcher";
import { useSession } from "./session";

type FetchCertificationSystemsKey = {
  url: `/internal/accounts/${string}/certification-systems`;
  token: string;
};

async function fetchCertificationSystems(
  req: FetchCertificationSystemsKey,
): Promise<Array<CertificationSystem>> {
  return await fetcher<Array<CertificationSystem>>(req);
}

/**
 * 認証制度へのアクセス
 */
export function useCertificationSystems() {
  const session = useSession();
  const accessTokenOrNull = session.data?.accessToken ?? null;
  const accountIdOrNull = session.data?.user?.accountId ?? null;

  const key: FetchCertificationSystemsKey | null = accessTokenOrNull
    ? {
        url: `/internal/accounts/${accountIdOrNull}/certification-systems`,
        token: accessTokenOrNull,
      }
    : null;

  return useSWR(key, fetchCertificationSystems);
}
