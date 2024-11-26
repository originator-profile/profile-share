import { arrayToTree } from "performant-array-to-tree";
import { ProfilePair } from "@originator-profile/verify";
import { UpdateAdIframeMessage } from "../types/message";

const childrenField = "children";

export type AdNode = {
  ad: ProfilePair[];
  frameId: number;
  parentFrameId: number;
  origin: URL["origin"];
};

export type AdTree = {
  [childrenField]: AdTree[];
} & AdNode;

/** 広告プロファイルが設置されたフレームの木構造を得る */
export function makeAdTree(ads: AdNode[]): AdTree | undefined {
  const [adTree] = arrayToTree(ads, {
    id: "frameId",
    parentId: "parentFrameId",
    rootParentIds: { "-1": true },
    childrenField,
    dataField: null,
  });
  if (!adTree) return;
  return adTree as AdTree;
}

/** 木から広告プロファイルを集める */
export function collectAdFromTree(adTree: AdTree): ProfilePair[] {
  const ad = adTree.children.flatMap(collectAdFromTree);
  return Array.from(
    new Map(adTree.ad.concat(ad).map((ad) => [ad.dp.sub, ad])).values(),
  );
}

/**
 * Profile Pair が設置されたiframe要素を更新する
 * @remarks
 * chrome.scripting API 必須
 */
export async function updateAdIframe(
  tabId: number,
  adTree: AdTree,
): Promise<void> {
  const targetOrigin = adTree.origin;
  const postMessage = (
    ad: ProfilePair[],
    sourceOrigin: URL["origin"],
    targetOrigin: URL["origin"],
    window: Window = globalThis.window,
  ) => {
    const message: UpdateAdIframeMessage = {
      type: "update-ad-iframe",
      ad,
      sourceOrigin,
    };
    window.parent.postMessage(message, targetOrigin);
  };
  await Promise.all(
    adTree.children.map((adTree) => {
      return chrome.scripting.executeScript({
        target: { tabId, frameIds: [adTree.frameId] },
        func: postMessage,
        args: [collectAdFromTree(adTree), adTree.origin, targetOrigin],
      });
    }),
  );
}
