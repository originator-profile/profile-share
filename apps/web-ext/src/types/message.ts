import { Profile } from "./profile";

export type FetchProfilesMessageRequest = {
  type: "fetch-profiles";
};
export type FetchProfilesMessageResponse = {
  type: "fetch-profiles";
  targetOrigin: string;
  profilesLink: string | null;
};
export type FocusProfileMessageRequest = {
  type: "focus-profile";
  profile: Profile;
};
export type FocusProfileMessageResponse = {
  type: "focus-profile";
};
export type CloseWindowMessageRequest = {
  type: "close-window";
};
export type CloseWindowMessageResponse = {
  type: "close-window";
};
export type MessageRequest =
  | FetchProfilesMessageRequest
  | FocusProfileMessageRequest
  | CloseWindowMessageRequest;
export type MessageResponse =
  | FetchProfilesMessageResponse
  | FocusProfileMessageResponse
  | CloseWindowMessageResponse;

export type EnterOverlayMessageRequest = {
  type: "enter-overlay";
};
export type EnterOverlayMessageResponse = {
  type: "enter-overlay";
  profile: Profile;
};
export type LeaveOverlayMessageRequest = {
  type: "leave-overlay";
};
export type ContentWindowPostMessageEvent = MessageEvent<
  EnterOverlayMessageRequest | LeaveOverlayMessageRequest
>;
export type IFramePostMessageEvent = MessageEvent<
  EnterOverlayMessageResponse | LeaveOverlayMessageRequest
>;
