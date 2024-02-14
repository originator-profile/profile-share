import { Profile, Dp } from "@originator-profile/ui/src/types";
import { AdProfilePair } from "@originator-profile/verify";

export type fetchProfileSetMessageRequest = {
  type: "fetch-profiles";
};
export type fetchProfileSetMessageResponse = {
  type: "fetch-profiles";
  /** JsonLdDocument の場合 true、ProfilesFetchFailed の場合 false */
  ok: boolean;
  /** JSON 文字列 (JsonLdDocument または ProfilesFetchFailed) */
  data: string;
  /** 閲覧しているコンテンツの URL の origin 文字列 */
  origin: string;
};
export type fetchWebsiteProfilePairMessageRequest = {
  type: "fetch-website-profile-pair";
};
export type fetchWebsiteProfilePairMessageResponse = {
  type: "fetch-website-profile-pair";
  /** JsonLdDocument の場合 true、ProfilesFetchFailed の場合 false */
  ok: boolean;
  /** JSON 文字列 (JsonLdDocument または ProfilesFetchFailed) */
  data: string;
  /** 閲覧しているコンテンツの URL の origin 文字列 */
  origin: string;
};

export type extractBodyRequest = {
  type: "extract-body";
  /** 署名対象テキストを指定する JSON 文字列 (DpLocator 型) */
  dpLocator: string;
  /** Dp が広告か否か (boolean) */
  isAdvertisement: boolean;
};

export type extractBodyResponse = {
  type: "extract-body";
  /** 署名対象テキストの場合 true、ProfileBodyExtractFailed の場合 false */
  ok: boolean;
  /** JSON 文字列（署名対象の文字列 または ProfileBodyExtractFailed） */
  data: string;
  /** iframe の URL 文字列 */
  url: string;
};

export type OverlayProfilesMessageRequest = {
  type: "overlay-profiles";
  profiles: Profile[];
  activeDp: Dp | null;
};
export type OverlayProfilesMessageResponse = {
  type: "overlay-profiles";
};
export type CloseWindowMessageRequest = {
  type: "close-window";
};
export type CloseWindowMessageResponse = {
  type: "close-window";
};
export type SelectOverlayDpMessageRequest = {
  type: "select-overlay-dp";
  dp: Dp;
};
export type ContentScriptMessageRequest =
  | fetchWebsiteProfilePairMessageRequest
  | OverlayProfilesMessageRequest
  | CloseWindowMessageRequest;
export type ContentScriptMessageResponse =
  | fetchWebsiteProfilePairMessageResponse
  | OverlayProfilesMessageResponse
  | CloseWindowMessageResponse;
export type ContentScriptAllFramesMessageRequest =
  | fetchProfileSetMessageRequest
  | extractBodyRequest;
export type ContentScriptAllFramesMessageResponse =
  | fetchProfileSetMessageResponse
  | extractBodyResponse;
export type BackgroundMessageRequest = SelectOverlayDpMessageRequest;
export type PopupMessageRequest = SelectOverlayDpMessageRequest;
export type EnterOverlayMessageRequest = {
  type: "enter-overlay";
};
export type EnterOverlayMessageResponse = {
  type: "enter-overlay";
  profiles: Profile[];
  activeDp: Dp | null;
};
export type LeaveOverlayMessage = {
  type: "leave-overlay";
};
/** サブフレームへの降下を開始するメッセージ  */
export type StartDescendFrameMessage = {
  type: "start-descend-frame";
};
/** サブフレームへ降下するメッセージ  */
export type DescendFrameMessage = {
  type: "descend-frame";
  /** 通信経路の URL オリジン */
  targetOrigins: Array<URL["origin"]>;
};
/** サブフレームから上昇するメッセージ  */
export type AscendFrameMessage = {
  type: "ascend-frame";
  /** Profile Pair */
  ad: AdProfilePair[];
  /** 通信経路の URL オリジン */
  targetOrigins: Array<URL["origin"]>;
};
/** サブフレームからの上昇を終了するメッセージ  */
export type EndAscendFrameMessage = {
  type: "end-ascend-frame";
  /** Profile Pair */
  ad: AdProfilePair[];
  /** 通信経路の URL オリジン */
  targetOrigins: Array<URL["origin"]>;
};
/** iframe 要素をオーバーレイ表示に入力するメッセージ */
export type EnterOverlayIFrameMessage = {
  type: "enter-overlay-iframe";
  /** Profile Pair */
  ad: AdProfilePair[];
};
export type ContentWindowPostMessageEvent = MessageEvent<
  | EnterOverlayMessageRequest
  | LeaveOverlayMessage
  | SelectOverlayDpMessageRequest
  | StartDescendFrameMessage
  | EndAscendFrameMessage
>;
export type AllFramesPostMessageEvent = MessageEvent<
  DescendFrameMessage | AscendFrameMessage
>;
export type IFramePostMessageEvent = MessageEvent<
  EnterOverlayMessageResponse | LeaveOverlayMessage | EnterOverlayIFrameMessage
>;
