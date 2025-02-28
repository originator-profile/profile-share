import { ProfilePair } from "@originator-profile/verify";

/**
 * Profile Pair が設置されたiframe要素を更新する
 * @deprecated
 **/
export type UpdateAdIframeMessage = {
  type: "update-ad-iframe";
  /** Profile Pair */
  ad: ProfilePair[];
  /** 送信元URLオリジン */
  sourceOrigin: URL["origin"];
};
/** @deprecated */
export type ContentWindowPostMessageEvent = MessageEvent<UpdateAdIframeMessage>;
