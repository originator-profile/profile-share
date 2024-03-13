import useSWR from "swr";
import { CertificationSystem } from "@originator-profile/model";
import { VerificationType } from "@originator-profile/ui";
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

  const certificationSystems = useSWR(key, fetchCertificationSystems);

  const nameOptions: string[] = (certificationSystems.data ?? []).map((c) => {
    const vt: VerificationType =
      (c.verifier?.id ?? null) === accountIdOrNull ? "自己宣言" : "第三者検証";

    return `${c.name} ${vt}`;
  });

  return Object.assign(certificationSystems, {
    nameOptions,
  });
}
