import { ProfilePair } from "@originator-profile/verify";

// ProfilePairの安全なプロキシ型
export type SafeProfilePair = {
  dp: any; // ContentAttestation
  raw?: any; // オプショナル
};

export interface IframeInfo {
  frameId: number;
  parentFrameId: number;
  rect: DOMRect;
  profilePairs: SafeProfilePair[];
  origin: string;
  url: string;
  depth: number;
  path: number[]; // フレームIDのパス
}

export interface IframeTree {
  info: IframeInfo;
  children: IframeTree[];
}

export interface IframeDetectionResult {
  mainFrame: IframeInfo;
  iframes: IframeInfo[];
  tree: IframeTree;
}

export interface IframePositionMessage {
  type: "iframe-position-request" | "iframe-position-response";
  frameId: number;
  rect?: DOMRect;
  profilePairs?: SafeProfilePair[];
}

export interface IframeSyncMessage {
  type: "iframe-sync";
  iframes: IframeInfo[];
}
