import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfileSet,
  expandProfilePairs,
} from "@originator-profile/verify";
import { Profile } from "@originator-profile/ui/src/types";
import { toProfile } from "@originator-profile/ui/src/utils";
import {
  fetchProfileSetMessageResponse,
  fetchWebsiteProfilePairMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { routes } from "./routes";

const key = "profiles" as const;
const WebsiteProfilePairKey = "website-profile-pair" as const;

async function fetchVerifiedProfiles([, tabId]: [
  _: typeof key,
  tabId: number,
]): Promise<{
  advertisers: string[];
  publishers: string[];
  main: string[];
  profiles: Profile[];
  origin: string;
}> {
  const frames = (await chrome.webNavigation.getAllFrames({ tabId })) ?? [];
  const responses: fetchProfileSetMessageResponse[] = await Promise.all(
    frames.map((frame) =>
      chrome.tabs.sendMessage(
        tabId,
        {
          type: "fetch-profiles",
        },
        {
          frameId: frame.frameId,
        },
      ),
    ),
  );

  const toplevel = frames.findIndex((frame) => frame.parentFrameId === -1);
  const profileSets = await Promise.allSettled(
    responses.map(async ({ ok, data }, index: number) => {
      const parsed = JSON.parse(data);
      if (!ok) {
        return new Promise<ReturnType<typeof expandProfileSet>>((_, reject) => {
          reject(Object.assign(new Error(parsed.message), parsed));
        });
      }
      const { ad } = await expandProfilePairs([parsed]);
      const advertisersFromProfilePairs = new Set<string>(
        ad.map((e) => e.op.sub),
      );

      if (toplevel === index) {
        const { advertisers, ...rest } = await expandProfileSet(parsed);
        return {
          ad,
          advertisers: Array.from(
            new Set<string>([...advertisers, ...advertisersFromProfilePairs]),
          ),
          ...rest,
        };
      } else {
        return { ad, advertisers: Array.from(advertisersFromProfilePairs) };
      }
    }),
  ).then((v) => {
    /* 複数rejectされていても最初のひとつだけthrow */
    const error = v.find((result) => result.status === "rejected");
    /* errorが存在する場合はかならず rejected であるが、型チェックのため確認 */
    if (error && error.status === "rejected") {
      throw error.reason;
    }
    return v.map((result) =>
      /* かならず fulfilled であるが、型チェックのため確認 */
      result.status === "fulfilled" ? result.value : undefined,
    );
  });

  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${registry}/.well-known/jwks.json`,
  );
  const keys = RemoteKeys(jwksEndpoint);

  const toplevelProfileSet = profileSets[toplevel] as
    | Awaited<ReturnType<typeof expandProfileSet>>
    | undefined;
  const toplevelOrigin = responses[toplevel]?.origin ?? "";
  const verifyResultsSet = await Promise.allSettled(
    profileSets.map((ps, index) => {
      if (ps) {
        const verify = ProfilesVerifier(
          {
            profile: index === toplevel && "profile" in ps ? ps.profile : [],
            ad: "ad" in ps ? ps.ad : [],
          },
          keys,
          registry,
          null,
          toplevelOrigin,
        );
        return verify();
      } else {
        return undefined;
      }
    }),
  ).then((v) => {
    /* 複数rejectされていても最初のひとつだけthrow */
    const error = v.find((result) => result.status === "rejected");
    /* errorが存在する場合はかならず rejected であるが、型チェックのため確認 */
    if (error && error.status === "rejected") {
      throw error.reason;
    }
    return v.map((result) =>
      /* かならず fulfilled であるが、型チェックのため確認 */
      result.status === "fulfilled" ? result.value : undefined,
    );
  });

  return {
    advertisers: [
      ...new Set(profileSets.flatMap((v) => (v ? v.advertisers : []))),
    ],
    publishers: toplevelProfileSet?.publishers ?? [],
    main: toplevelProfileSet?.main ?? [],
    profiles: verifyResultsSet.flatMap((results) =>
      results ? results.map(toProfile) : [],
    ),
    origin: toplevelOrigin,
  };
}

async function fetchVerifiedWebsiteProfilePair([, tabId]: [
  _: typeof WebsiteProfilePairKey,
  tabId: number,
]): Promise<{
  website: Profile[];
  origin: string;
}> {
  const { ok, data, origin }: fetchWebsiteProfilePairMessageResponse =
    await chrome.tabs.sendMessage(tabId, {
      type: "fetch-website-profile-pair",
    });
  if (!ok) {
    // 取得に失敗した場合にはエラーにしない（ website PP の設置は任意のため）
    return { website: [], origin };
  }
  const parsed = JSON.parse(data);
  const { website } = await expandProfilePairs([parsed]);

  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${registry}/.well-known/jwks.json`,
  );
  const keys = RemoteKeys(jwksEndpoint);

  const verifyResults =
    (website[0] &&
      (await ProfilesVerifier(
        {
          profile: [website[0].op.profile, website[0].dp.profile],
        },
        keys,
        registry,
        null,
        origin,
      )())) ??
    [];

  return {
    website: verifyResults.map(toProfile),
    origin,
  };
}

/**
 * Profile Set 取得 (要 Base コンポーネント)
 */
function useProfileSet() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  // TODO: 自動再検証する場合は取得エンドポイントが変わりうることをUIの振る舞いで考慮して
  const { data, error } = useSWRImmutable([key, tabId], fetchVerifiedProfiles);
  const { data: dataWebsite, error: errorWebsite } = useSWRImmutable(
    [WebsiteProfilePairKey, tabId],
    fetchVerifiedWebsiteProfilePair,
  );

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
            ].join("/"),
          );
      }
    };
    chrome.runtime.onMessage.addListener(handleMessageResponse);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageResponse);
    };
  }, [tabId, navigate]);

  return {
    ...dataWebsite,
    ...data,
    error:
      error ||
      errorWebsite ||
      (dataWebsite?.website.length === 0 && data?.profiles.length === 0
        ? new Error("プロファイルが見つかりませんでした")
        : null),
    tabId,
  };
}

export default useProfileSet;
