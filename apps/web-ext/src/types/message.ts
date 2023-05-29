import { Profile, Dp } from "@webdino/profile-ui/src/types";

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
  | fetchProfileSetMessageRequest
  | OverlayProfilesMessageRequest
  | CloseWindowMessageRequest;
export type ContentScriptMessageResponse =
  | fetchProfileSetMessageResponse
  | OverlayProfilesMessageResponse
  | CloseWindowMessageResponse;
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
export type LeaveOverlayMessageRequest = {
  type: "leave-overlay";
};
export type ContentWindowPostMessageEvent = MessageEvent<
  | EnterOverlayMessageRequest
  | LeaveOverlayMessageRequest
  | SelectOverlayDpMessageRequest
>;
export type IFramePostMessageEvent = MessageEvent<
  EnterOverlayMessageResponse | LeaveOverlayMessageRequest
>;
