import {
  ProfilePayloadWithMetadata,
  DpPayloadWithMetadata,
} from "@originator-profile/ui";
import { ProfilePair } from "@originator-profile/verify";

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
  | OverlayProfilesMessageRequest
  | CloseWindowMessageRequest;
export type ContentScriptMessageResponse =
  | OverlayProfilesMessageResponse
  | CloseWindowMessageResponse;
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
