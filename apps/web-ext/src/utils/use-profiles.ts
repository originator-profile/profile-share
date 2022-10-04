import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  fetchProfiles,
  expandProfiles,
} from "@webdino/profile-verify";
import {
  FetchProfilesMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { Profile } from "../types/profile";
import { toProfile } from "./profile";
import { routes } from "./routes";

const key = "profiles";

async function fetchVerifiedProfiles(_: typeof key, tabId: number) {
  const { profileEndpoint }: FetchProfilesMessageResponse =
    await chrome.tabs.sendMessage(tabId, {
      type: "fetch-profiles",
    });
  const profiles = await fetchProfiles(profileEndpoint);
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
    profileEndpoint: new URL(profileEndpoint),
  };
}

/**
 * Profiles Set 取得 (要 Base コンポーネント)
 */
function useProfiles() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  // TODO: 自動再検証する場合は取得エンドポイントが変わりうることをUIの振る舞いで考慮して
  const { data, error } = useSWRImmutable<{
    advertisers: string[];
    publishers: string[];
    main: string[];
    profiles: Profile[];
    profileEndpoint: URL;
  }>([key, tabId], fetchVerifiedProfiles);

  useEvent("unload", async function () {
    await chrome.tabs.sendMessage(tabId, { type: "close-window" });
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleMessageResponse = async (message: PopupMessageRequest) => {
      switch (message.type) {
        case "select-overlay-dp":
          navigate(
            [
              routes.base.build({ tabId: String(tabId) }),
              routes.publ.build(message.dp),
            ].join("/")
          );
      }
    };
    chrome.runtime.onMessage.addListener(handleMessageResponse);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageResponse);
    };
  }, [tabId, navigate]);

  return {
    ...data,
    error,
    tabId,
  };
}

export default useProfiles;
