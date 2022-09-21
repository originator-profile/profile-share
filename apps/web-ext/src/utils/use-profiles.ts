import browser from "webextension-polyfill";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  fetchProfiles,
  expandProfiles,
} from "@webdino/profile-verify";
import { FetchProfilesMessageResponse } from "../types/message";
import { Profile } from "../types/profile";
import { toProfile } from "./profile";

const key = "profiles";

async function fetchVerifiedProfiles(_: typeof key, tabId: number) {
  const { targetOrigin, profilesLink }: FetchProfilesMessageResponse =
    await browser.tabs.sendMessage(tabId, {
      type: "fetch-profiles",
    });
  const { profiles, profileEndpoint } = await fetchProfiles(
    targetOrigin,
    profilesLink
  );
  const { advertisers, publishers, main, profile } = await expandProfiles(
    profiles
  );
  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(`${registry}/.well-known/jwks.json`);
  const keys = RemoteKeys(jwksEndpoint);
  const verify = ProfilesVerifier({ profile }, keys, registry, null);
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

/**
 * Profiles Set 取得 (要 Base コンポーネント)
 */
function useProfiles() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  const { data, error } = useSWR<{
    advertisers: string[];
    publishers: string[];
    main: string[];
    profiles: Profile[];
    targetOrigin?: string;
    profileEndpoint?: string;
  }>([key, tabId], fetchVerifiedProfiles);

  useEvent("unload", () => {
    browser.tabs.sendMessage(tabId, { type: "close-window" });
  });

  return {
    ...data,
    error,
    tabId,
    targetOrigin: data?.targetOrigin,
    profileEndpoint: data?.profileEndpoint,
  };
}

export default useProfiles;
