export type FetchProfilesMessageRequest = {
  type: "fetch-profiles";
};
export type FetchProfilesMessageResponse = {
  type: "fetch-profiles";
  targetOrigin: string;
};
export type MessageRequest = FetchProfilesMessageRequest;
export type MessageResponse = FetchProfilesMessageResponse;
