import { VerifyIntegrity } from "@originator-profile/verify";
import { FetchCredentialsMessagingFailed } from "./errors";
import { credentialsMessenger } from "./events";
import {
  FrameCredentials,
  FrameResponse,
  TabCredentials,
  FetchCredentialsMessageResult,
} from "./types";

const createError = <T>(
  result: FetchCredentialsMessageResult<T>,
): Error | undefined => {
  if (result.ok) return undefined;
  return new Error("Fetch credentials failed", {
    cause: JSON.parse(result.error),
  });
};

/**
 * タブ内の各フレームでクレデンシャルを取得する。
 * @param frames フレームのリスト
 * @param tabId タブID
 * @returns 結果の配列
 */
async function fetchAllFramesCredentials(
  frames: chrome.webNavigation.GetAllFrameResultDetails[],
  tabId: number,
): Promise<FrameCredentials[]> {
  const results: PromiseSettledResult<FrameCredentials>[] =
    await Promise.allSettled(
      frames.map(async (frame): Promise<FrameCredentials> => {
        const frameResponse: FrameResponse = {
          frameId: frame.frameId,
          parentFrameId: frame.parentFrameId,
        };
        const result = await credentialsMessenger.compatSendMessage(
          "fetchCredentials",
          null,
          tabId,
          frame.frameId,
        );
        if (result instanceof Error) {
          throw new FetchCredentialsMessagingFailed(
            "Fetch frame credentials error occured",
            {
              error: result,
              ...frameResponse,
            },
          );
        }

        return {
          ops: result.ops.ok ? result.ops.data : [],
          cas: result.cas.ok ? result.cas.data : [],
          error: {
            ops: createError(result.ops),
            cas: createError(result.cas),
          },
          url: result.url,
          origin: result.origin,
          ...frameResponse,
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
      (r): r is PromiseFulfilledResult<FrameCredentials> =>
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
export async function fetchTabCredentials(
  tabId: number,
): Promise<TabCredentials> {
  const frames = (await chrome.webNavigation.getAllFrames({ tabId })) ?? [];
  const frameCredentials = await fetchAllFramesCredentials(frames, tabId);

  const topLevelFrameIndex = frames.findIndex(
    (frame) => frame.parentFrameId === -1,
  );
  if (topLevelFrameIndex === -1) {
    throw Error("No response from top level frame");
  }
  const [topLevelFrameCredentials] = frameCredentials.splice(
    topLevelFrameIndex,
    1,
  );
  if (!topLevelFrameCredentials) {
    throw Error("No response from top level frame");
  }

  return {
    ...topLevelFrameCredentials,
    frames: frameCredentials,
  };
}

/**
 * フレーム内 Target Integrity 検証器
 * @param tabId タブID
 * @param frameId フレームID
 * @returns フレーム内 Target Integrity 検証器
 */
export const FrameIntegrityVerifier =
  (tabId: number, frameId: number): VerifyIntegrity =>
  (content) =>
    credentialsMessenger.compatSendMessage(
      "verifyIntegrity",
      [content],
      tabId,
      frameId,
    );
