export type OpMessageRequest = {
  type: "op";
};
export type OpMessageResponse = {
  type: "op";
  targetOrigin: string;
};
export type MessageRequest = OpMessageRequest;
export type MessageResponse = OpMessageResponse;
