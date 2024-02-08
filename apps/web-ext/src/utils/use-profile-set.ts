import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfileSet,
  expandProfilePairs,
  LocalKeys,
  verifyBody,
  ProfileBodyExtractFailed,
} from "@originator-profile/verify";
import { NodeObject } from "jsonld";
import { Profile, Dp } from "@originator-profile/ui/src/types";
import { toProfile } from "@originator-profile/ui/src/utils";
import {
  extractBodyRequest,
  extractBodyResponse,
  fetchProfileSetMessageRequest,
  fetchProfileSetMessageResponse,
  fetchWebsiteProfilePairMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { routes } from "./routes";
import { isDpLocator } from "./dp-locator";
import { isAdvertisement, isDp, isOp } from "@originator-profile/core";
import { Jwks } from "@originator-profile/model";
import { DpLocator } from "../types/dp-locator";

const key = "profiles" as const;
const WebsiteProfilePairKey = "website-profile-pair" as const;
const bodiesKey = "bodies" as const;

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
  const responses: Array<{
    data: NodeObject;
    origin: string;
    frameId: number;
  }> = await Promise.all(
    frames.map((frame) =>
      chrome.tabs
        .sendMessage<
          fetchProfileSetMessageRequest,
          fetchProfileSetMessageResponse
        >(
          tabId,
          {
            type: "fetch-profiles",
          },
          {
            frameId: frame.frameId,
          },
        )
        .then((response) => {
          const data = JSON.parse(response.data);
          if (!response.ok) throw data;
          return { data, origin: response.origin, frameId: frame.frameId };
        }),
    ),
  ).catch((data) => {
    throw Object.assign(new Error(data.message), data);
  });
  const topLevelFrameIndex = frames.findIndex(
    (frame) => frame.parentFrameId === -1,
  );
  const topLevelFrameId = frames[topLevelFrameIndex]?.frameId;
  const topLevelResponse = responses[topLevelFrameIndex];

  const profileSet = await expandProfileSet(topLevelResponse?.data ?? []);
  const ads = await Promise.all(
    responses.map(({ data, frameId }) =>
      expandProfilePairs(data).then(({ ad }) => ({
        ad,
        frameId,
      })),
    ),
  );

  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${registry}/.well-known/jwks.json`,
  );
  const keys = RemoteKeys(jwksEndpoint);
  const origin = topLevelResponse?.origin ?? "";
  const verify = ProfilesVerifier(
    {
      profile: profileSet.profile,
      ad: ads.flatMap(({ ad }) => ad),
    },
    keys,
    registry,
    null,
    origin,
  );
  const verifyResult = await verify();

  // verifyResult を frameId に紐付けて、 Profile 型に変換する
  const profiles = verifyResult
    .map((result) => {
      let sub: string | undefined;
      let iss: string | undefined;
      if (result instanceof Error || "op" in result) {
        return toProfile(result);
      }
      if ("dp" in result) {
        sub = result.dp.subject;
        iss = result.dp.issuer;
      }

      const frames = ads.filter(({ ad }) =>
        ad.some((value) => value.op.sub === iss && value.dp.sub === sub),
      );

      // frame が見つからなかった場合、 topLevelFrameId に紐付ける
      const frameIds =
        frames.length > 0
          ? frames.map((f) => f.frameId)
          : typeof topLevelFrameId !== "undefined"
            ? [topLevelFrameId]
            : [];
      return { frameIds, ...toProfile(result) } as Dp;
    })
    .filter((value) => typeof value !== "undefined");

  return {
    advertisers: [
      ...new Set([
        ...profileSet.advertisers,
        ...ads.flatMap(({ ad }) => ad.map(({ op }) => op.sub)),
      ]),
    ],
    publishers: profileSet.publishers,
    main: profileSet.main,
    profiles,
    origin,
  };
}

async function extractBodiesOfDp(
  tabId: number,
  dp: Dp,
): Promise<(string | ProfileBodyExtractFailed)[]> {
  const dpLocator = dp.item.find(isDpLocator);
  const isAd = dp.item.some(isAdvertisement);
  if (!dpLocator || !dp.frameIds) {
    return [];
  }
  const responses = await Promise.all(
    dp.frameIds.map((frameId) => {
      return chrome.tabs
        .sendMessage<extractBodyRequest, extractBodyResponse>(
          tabId,
          {
            type: "extract-body",
            dpLocator: JSON.stringify(dpLocator),
            isAdvertisement: isAd,
          },
          {
            frameId,
          },
        )
        .then((response) => {
          const data = JSON.parse(response.data);
          if (!response.ok) {
            return Object.assign(
              new ProfileBodyExtractFailed(data.message),
              data,
            );
          }
          return data;
        });
    }),
  );
  return Array.from(new Set(responses));
}

async function verifyBodiesOfDp(
  dpLocator: DpLocator,
  bodies: string[],
  jwks: Jwks,
): Promise<Awaited<ReturnType<typeof verifyBody>>[]> {
  const verifyResults = await Promise.all(
    bodies.map((body) =>
      verifyBody(body, dpLocator.proof.jws, LocalKeys(jwks)),
    ),
  );
  return verifyResults;
}

async function fetchVerifiedBodies([, tabId, profiles]: [
  _: typeof bodiesKey,
  tabId: number,
  profiles: Profile[],
]): Promise<Profile[]> {
  if (profiles.some((p) => "error" in p)) {
    return profiles;
  }

  const ops = profiles.filter(isOp);
  const dps = profiles.filter(isDp);

  const verifiedDps = await Promise.all(
    dps.map<Promise<Dp>>(async (dp) => {
      const dpLocator = dp.item.find(isDpLocator);

      if (!dpLocator) {
        return {
          ...dp,
          bodyError: "dpLocator not found in dp",
        };
      }
      const jwks = ops.find((op) => op.subject === dp.issuer)?.jwks;

      const bodies = await extractBodiesOfDp(tabId, dp);
      const extractError = bodies.find(
        (result) => result instanceof ProfileBodyExtractFailed,
      );
      if (extractError && extractError instanceof ProfileBodyExtractFailed) {
        return {
          ...dp,
          bodyError: extractError.message,
        };
      }

      const verifyBodyResults = await verifyBodiesOfDp(
        dpLocator,
        bodies as string[],
        jwks ?? { keys: [] },
      );
      const verifyError = verifyBodyResults.find(
        (result) => result instanceof Error,
      );
      if (verifyError && verifyError instanceof Error) {
        return {
          ...dp,
          bodyError: verifyError.message,
          body: verifyError.result.body,
        };
      }
      return { ...dp, body: (bodies as string[])[0] };
    }),
  );

  return [...ops, ...verifiedDps];
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
  const { data: dataVerifiedBodies, error: errorVerifiedBodies } =
    useSWRImmutable(
      data?.profiles ? [bodiesKey, tabId, data.profiles] : null,
      fetchVerifiedBodies,
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
    profiles: dataVerifiedBodies,
    error:
      error ||
      errorWebsite ||
      errorVerifiedBodies ||
      (dataWebsite?.website.length === 0 && data?.profiles.length === 0
        ? new Error("プロファイルが見つかりませんでした")
        : null),
    tabId,
  };
}

export default useProfileSet;
