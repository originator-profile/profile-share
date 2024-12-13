import {
  OpsInvalid,
  OpsVerifier,
  OpsVerifyFailed,
  VerifiedOps,
} from "@originator-profile/verify";
import { useParams } from "react-router";
import { useEvent } from "react-use";
import useSWRImmutable from "swr/immutable";
import { getRegistryKeys } from "../../utils/get-registry-keys";
import { VerifiedCas } from "./types";
import { fetchTabCredentials, FrameIntegrityVerifier } from "./messaging";
import { verifyCas } from "./cas";
import { CasVerifyFailed } from "./errors";

const CREDENTIALS_KEY = "credentials";
const REGISTRY = import.meta.env.PROFILE_ISSUER;

type FetchVerifiedCredentialsResult = {
  ops: VerifiedOps;
  cas: VerifiedCas;
  origin: string;
  url: string;
};

/**
 * タブ内のクレデンシャルを取得して検証する。
 * @param tabId タブID
 * @returns 検証済みクレデンシャルおよびタブのorigin,url
 */
async function fetchVerifiedCredentials([, tabId]: [
  _: typeof CREDENTIALS_KEY,
  tabId: number,
]): Promise<FetchVerifiedCredentialsResult> {
  const { ops, cas, origin, url, frameId } = await fetchTabCredentials(tabId);

  const opsVerifier = OpsVerifier(ops, getRegistryKeys(), `dns:${REGISTRY}`);
  const verifiedOps = await opsVerifier();
  if (
    verifiedOps instanceof OpsInvalid ||
    verifiedOps instanceof OpsVerifyFailed
  ) {
    throw verifiedOps;
  }
  const verifiedCas = await verifyCas(
    cas,
    verifiedOps,
    url,
    FrameIntegrityVerifier(tabId, frameId),
  );
  if (verifiedCas instanceof CasVerifyFailed) {
    throw verifiedCas;
  }
  return {
    ops: verifiedOps,
    cas: verifiedCas,
    origin,
    url,
  };
}

/**
 * Credentials 取得 (要 Base コンポーネント)
 */
export function useCredentials() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  // TODO: 自動再検証する場合は取得エンドポイントが変わりうることをUIの振る舞いで考慮して
  const { data: credentials, error } = useSWRImmutable<
    FetchVerifiedCredentialsResult,
    Error,
    [typeof CREDENTIALS_KEY, number]
  >([CREDENTIALS_KEY, tabId], fetchVerifiedCredentials);
  const { ops, cas, origin } = credentials ?? {};

  /* TODO: タブ内からCAのtargetを検索して検証する, 以下は旧ProfileSet時代のコードをコメントアウトしたもの */
  /*
  const { data: profileSet, error: errorVerifiedBodies } = useSWRImmutable<
    ProfileSet,
    Error,
    [typeof VERIFIED_BODIES_KEY, number, ProfileSet] | null
  >(
    data ? [VERIFIED_BODIES_KEY, tabId, data] : null,
    fetchVerifiedBodies,
  );
  */

  useEvent("unload", async function () {
    await chrome.tabs.sendMessage(tabId, { type: "close-window" });
  });

  return {
    origin,
    ops,
    cas,
    error,
    tabId,
  };
}
