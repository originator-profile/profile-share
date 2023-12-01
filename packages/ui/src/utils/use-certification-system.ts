import { OpCredential, CertificationSystem } from "@originator-profile/model";
import useSWR from "swr";

async function fetcher(url: string): Promise<CertificationSystem> {
  const response = await fetch(url);
  const certificationSystem = await response.json();
  return certificationSystem;
}

/** 認証制度を取得するカスタムフック */
export default function useCertificationSystem(url: OpCredential["url"]) {
  return useSWR(url || null, fetcher);
}
