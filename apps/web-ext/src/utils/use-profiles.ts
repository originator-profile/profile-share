import browser from "webextension-polyfill";
import useSWR, { mutate } from "swr";
import {
  RemoteKeys,
  ProfilesVerifier,
  fetchProfiles,
  expandProfiles,
} from "@webdino/profile-verify";
import { FetchProfilesMessageResponse } from "../types/message";
import { Profile } from "../types/profile";
import { toProfile } from "./profile";
import storage from "./storage";

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

function useProfiles() {
  const tabId = storage.getItem("tabId");
  const { data, error } = useSWR<{
    advertisers: string[];
    publishers: string[];
    main: string[];
    profiles: Profile[];
    targetOrigin?: string;
    profileEndpoint?: string;
  }>(tabId ? [key, tabId] : null, fetchVerifiedProfiles);
  return {
    ...data,
    error,
    targetOrigin: data?.targetOrigin,
    profileEndpoint: data?.profileEndpoint,
  };
}

export default useProfiles;

export function revalidateProfiles(targetOrigin?: string) {
  return mutate([key, targetOrigin]);
}
