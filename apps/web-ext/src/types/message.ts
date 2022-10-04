import { Profile, Dp } from "./profile";

export type FetchProfilesMessageRequest = {
  type: "fetch-profiles";
};
export type FetchProfilesMessageResponse = {
  type: "fetch-profiles";
  profileEndpoint: string;
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
  | FetchProfilesMessageRequest
  | OverlayProfilesMessageRequest
  | CloseWindowMessageRequest;
export type ContentScriptMessageResponse =
  | FetchProfilesMessageResponse
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
