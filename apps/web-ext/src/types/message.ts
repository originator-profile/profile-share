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
export type MessageRequest =
  | FetchProfilesMessageRequest
  | FocusProfileMessageRequest;
export type MessageResponse =
  | FetchProfilesMessageResponse
  | FocusProfileMessageResponse;
