import browser from "webextension-polyfill";
import { expand } from "jsonld";
import useSWR, { mutate } from "swr";
import { useAsync } from "react-use";
import { RemoteKeys, ProfilesVerifier } from "@webdino/profile-verify";
import { FetchProfilesMessageResponse } from "../types/message";
import { Profile } from "../types/profile";
import { toProfile } from "./profile";
import storage from "./storage";

const key = "profiles";

async function fetchProfiles(
  _: typeof key,
  targetOrigin?: string,
  profilesLink?: string
) {
  // TODO: このあたりの取得プロセスはシステム全体で固有のものなので外部化してテスタビリティを高めておきたい
  const context = "https://github.com/webdino/profile#";
  if (!profilesLink && !targetOrigin) {
    const err = new Error(
      "プロファイルを取得するウェブページが特定できませんでした"
    );
    throw {
      ...err,
      message: `プロファイルを取得できませんでした:\n${err.message}`,
    };
  }
  const profileEndpoint = new URL(
    profilesLink ?? `${targetOrigin}/.well-known/op-document`
  );
  const data = await fetch(profileEndpoint.href)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ステータスコード ${res.status}`);
      }
      return res.json();
    })
    .catch((e) => e);
  if (data instanceof Error) {
    throw {
      ...data,
      message: `プロファイルを取得できませんでした:\n${data.message}`,
    };
  }
  // TODO: このあたりの JSON-LD の Profiles Set の変換も外部化してテスタビリティを高めたい
  const [expanded] = await expand(data);
  if (!expanded)
    return { advertisers: [], publishers: [], main: [], profiles: [] };
  const advertisers: string[] =
    // @ts-expect-error assert
    expanded[`${context}advertiser`]?.map(
      (advertiser: { "@value": string }) => advertiser["@value"]
    ) ?? [];
  const publishers: string[] =
    // @ts-expect-error assert
    expanded[`${context}publisher`]?.map(
      (publisher: { "@value": string }) => publisher["@value"]
    ) ?? [];
  const main: string[] =
    // @ts-expect-error assert
    expanded[`${context}main`]?.map(
      (main: { "@value": string }) => main["@value"]
    ) ?? [];
  // @ts-expect-error assert
  const profile: string[] = expanded[`${context}profile`].map(
    (profile: { "@value": string }) => profile["@value"]
  );
  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(`${registry}/.well-known/jwks.json`);
  const keys = RemoteKeys(jwksEndpoint);
  const verify = ProfilesVerifier({ profile }, keys, registry);
  const verifyResults = await verify();
  return {
    advertisers,
    publishers,
    main,
    profiles: verifyResults.map(toProfile),
    targetOrigin: targetOrigin,
    profileEndpoint: profileEndpoint.href,
  };
}

function useProfiles() {
  const message = useAsync(async () => {
    const tabId = storage.getItem("tabId");
    if (tabId === null) return null;
    const response: FetchProfilesMessageResponse =
      await browser.tabs.sendMessage(tabId, {
        type: "fetch-profiles",
      });
    return response;
  });
  const { data, error } = useSWR<{
    advertisers: string[];
    publishers: string[];
    main: string[];
    profiles: Profile[];
    targetOrigin?: string;
    profileEndpoint?: string;
  }>(
    [key, message.value?.targetOrigin, message.value?.profilesLink],
    fetchProfiles
  );
  return {
    ...data,
    error: message.error || error,
    targetOrigin: data?.targetOrigin,
    profileEndpoint: data?.profileEndpoint,
  };
}

export default useProfiles;

export function revalidateProfiles(targetOrigin?: string) {
  return mutate([key, targetOrigin]);
}
