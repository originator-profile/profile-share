import {
  ProfilePayloadWithMetadata,
  DpPayloadWithMetadata,
} from "@originator-profile/ui";
import { ProfilePair } from "@originator-profile/verify";

export type fetchWebsiteProfilePairMessageRequest = {
  type: "fetch-website-profile-pair";
  /** エポックミリ秒 */
  timestamp: number;
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

export type FetchSiteProfileMessageRequest = {
  type: "fetch-site-profile";
  /** エポックミリ秒 */
  timestamp: number;
};
export type FetchSiteProfileMessageResponse = {
  type: "fetch-site-profile";
  /** JSON の場合 true、ProfilesFetchFailed の場合 false */
  ok: boolean;
  /** JSON 文字列 (JSON または ProfilesFetchFailed) */
  data: string;
  /** 閲覧しているコンテンツの URL の origin 文字列 */
  origin: string;
};

export type extractBodyRequest = {
  type: "extract-body";
  /** エポックミリ秒 */
  timestamp: number;
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
  /** エポックミリ秒 */
  timestamp: number;
  profiles: ProfilePayloadWithMetadata[];
  websiteProfiles?: ProfilePayloadWithMetadata[];
  activeDp: DpPayloadWithMetadata | null;
};
export type OverlayProfilesMessageResponse = {
  type: "overlay-profiles";
};
export type CloseWindowMessageRequest = {
  type: "close-window";
  /** エポックミリ秒 */
  timestamp: number;
};
export type CloseWindowMessageResponse = {
  type: "close-window";
};
export type SelectOverlayDpMessageRequest = {
  type: "select-overlay-dp";
  dp: DpPayloadWithMetadata;
};
export type ContentScriptMessageRequest =
  | fetchWebsiteProfilePairMessageRequest
  | OverlayProfilesMessageRequest
  | CloseWindowMessageRequest
  | FetchSiteProfileMessageRequest;
export type ContentScriptMessageResponse =
  | fetchWebsiteProfilePairMessageResponse
  | OverlayProfilesMessageResponse
  | CloseWindowMessageResponse
  | FetchSiteProfileMessageResponse;
export type ContentScriptAllFramesMessageRequest = extractBodyRequest;
export type ContentScriptAllFramesMessageResponse = extractBodyResponse;
export type BackgroundMessageRequest = SelectOverlayDpMessageRequest;
export type PopupMessageRequest = SelectOverlayDpMessageRequest;
export type EnterOverlayMessageRequest = {
  type: "enter-overlay";
};
export type EnterOverlayMessageResponse = {
  type: "enter-overlay";
  profiles: ProfilePayloadWithMetadata[];
  websiteProfiles?: ProfilePayloadWithMetadata[];
  activeDp: DpPayloadWithMetadata | null;
};
export type LeaveOverlayMessage = {
  type: "leave-overlay";
};
/** Profile Pair が設置されたiframe要素を更新する */
export type UpdateAdIframeMessage = {
  type: "update-ad-iframe";
  /** Profile Pair */
  ad: ProfilePair[];
  /** 送信元URLオリジン */
  sourceOrigin: URL["origin"];
};
export type ContentWindowPostMessageEvent = MessageEvent<
  | EnterOverlayMessageRequest
  | LeaveOverlayMessage
  | SelectOverlayDpMessageRequest
  | UpdateAdIframeMessage
>;
export type IFramePostMessageEvent = MessageEvent<
  EnterOverlayMessageResponse | LeaveOverlayMessage
>;
