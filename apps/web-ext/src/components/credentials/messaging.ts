import { VerifyIntegrity } from "@originator-profile/verify";
import { credentialsMessenger } from "./events";
import {
  FetchCredentialsMessageFrameResponse,
  FrameCredentials,
  TabCredentials,
} from "./types";

/**
 * タブ内の各フレームでクレデンシャルを取得する。
 * @param frames フレームのリスト
 * @param tabId タブID
 * @returns 結果の配列
 */
async function fetchAllFramesCredentials(
  frames: chrome.webNavigation.GetAllFrameResultDetails[],
  tabId: number,
): Promise<FetchCredentialsMessageFrameResponse[]> {
  const results: PromiseSettledResult<FetchCredentialsMessageFrameResponse>[] =
    await Promise.allSettled(
      frames.map(async (frame) => {
        const result = await credentialsMessenger.compatSendMessage(
          "fetchCredentials",
          null,
          tabId,
          frame.frameId,
        );
        if (result instanceof Error || result.data instanceof Error) {
          /* eslint-disable-next-line @typescript-eslint/only-throw-error */
          throw { result, frame };
        }
        if (typeof result.error === "string") {
          const errorInfo = JSON.parse(result.error);
          throw errorInfo;
        }

        return {
          data: result.data,
          url: result.url,
          origin: result.origin,
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
      (r): r is PromiseFulfilledResult<FetchCredentialsMessageFrameResponse> =>
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
  const responses = await fetchAllFramesCredentials(frames, tabId);
  const frameCredentials: FrameCredentials[] = responses.map((response) => {
    const { data, ...rest } = response;
    const [ops, cas] = data;
    return {
      ops,
      cas,
      ...rest,
    };
  });

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
