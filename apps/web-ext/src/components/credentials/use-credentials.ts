import { RemoteKeys } from "@originator-profile/cryptography";
import {
  CaVerificationResult,
  CaVerifier,
  OpsVerificationResult,
  OpsVerifier,
} from "@originator-profile/verify";
import { useParams } from "react-router";
import { useEvent } from "react-use";
import useSWRImmutable from "swr/immutable";
import { credentialsMessenger, FetchCredentialsMessageResult } from "./events";

const CREDENTIALS_KEY = "credentials";
const REGISTRY = import.meta.env.PROFILE_ISSUER;

type FetchCredentialsResultWithFrameId = FetchCredentialsMessageResult & {
  frameId: number;
  parentFrameId: number;
};

type FetchVerifiedCredentialsResult = {
  ops: OpsVerificationResult;
  cas: (
    | CaVerificationResult
    | { main: boolean; attestation: CaVerificationResult }
  )[];
  origin: string;
  url: string;
};

/**
 * OP レジストリの JWKS を取得する
 * @returns レジストリの JWKS
 */
function getRegistryKeys() {
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && REGISTRY === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${REGISTRY}/.well-known/jwks.json`,
  );

  return RemoteKeys(jwksEndpoint);
}

/**
 * タブ内の各フレームでクレデンシャルを取得する。
 * @param frames フレームのリスト
 * @param tabId タブID
 * @returns 結果の配列
 */
async function fetchCredentials(
  frames: chrome.webNavigation.GetAllFrameResultDetails[],
  tabId: number,
) {
  const results: PromiseSettledResult<FetchCredentialsResultWithFrameId>[] =
    await Promise.allSettled(
      frames.map(async (frame) => {
        const result = await credentialsMessenger.sendMessage(
          "fetchCredentials",
          null,
          tabId,
        );
        if (result instanceof Error) throw result;
        return {
          ...result,
          frameId: frame.frameId,
          parentFrameId: frame.parentFrameId,
        };
      }),
    );

  const errors = results.filter(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );
  errors.forEach(({ reason }) => {
    console.error(reason);
  });

  const responses = results
    .filter(
      (r): r is PromiseFulfilledResult<FetchCredentialsResultWithFrameId> =>
        r.status === "fulfilled",
    )
    .map(({ value }) => value);

  if (responses.length === 0) {
    const error = errors[0]?.reason;
    throw Object.assign(new Error(error.message), error);
  }
  return responses;
}

/**
 * タブ内のクレデンシャルを取得する。
 * @param tabId タブID
 * @returns クレデンシャルおよびタブのorigin,url
 */
async function fetchCredentialsFromTab(tabId: number) {
  const frames = (await chrome.webNavigation.getAllFrames({ tabId })) ?? [];
  const responses = await fetchCredentials(frames, tabId);

  const topLevelFrameIndex = frames.findIndex(
    (frame) => frame.parentFrameId === -1,
  );
  //const topLevelFrameId = frames[topLevelFrameIndex]?.frameId;
  const topLevelResponse = responses[topLevelFrameIndex];
  if (!topLevelResponse) {
    throw Error("No response from top level frame");
  }
  if (topLevelResponse.data instanceof Error) {
    throw topLevelResponse.data;
  }
  const [ops, cas] = topLevelResponse.data ?? [];
  const origin = topLevelResponse.origin ?? "";
  const url = topLevelResponse.url ?? "";

  return {
    ops,
    cas,
    origin,
    url,
  };
}

/**
 * タブ内のクレデンシャルを取得して検証する。
 * @param tabId タブID
 * @returns 検証済みクレデンシャルおよびタブのorigin,url
 */
async function fetchVerifiedCredentials([, tabId]: [
  _: typeof CREDENTIALS_KEY,
  tabId: number,
]): Promise<FetchVerifiedCredentialsResult> {
  const { ops, cas, origin, url } = await fetchCredentialsFromTab(tabId);

  const opsVerifier = OpsVerifier(ops, getRegistryKeys(), REGISTRY);
  const verifiedOps = await opsVerifier();
  const verifiedCas = await Promise.all(
    cas.map(async (ca) => {
      const main = typeof ca === "object" && ca !== null && "main" in ca;
      const verify = CaVerifier(
        main ? ca.attestation : ca,
        getRegistryKeys(),
        REGISTRY,
        new URL(url),
      );
      return main
        ? { main: true, attestation: await verify() }
        : await verify();
    }),
  );
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
function useCredentials() {
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

export default useCredentials;
