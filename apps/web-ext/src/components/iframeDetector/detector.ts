import { ProfilePair } from "@originator-profile/verify";
import {
  IframeInfo,
  IframePositionMessage,
  IframeTree,
  SafeProfilePair,
} from "./types";

/**
 * chrome.scripting APIを使用してiframeの位置を特定する
 */
export class IframeDetector {
  private tabId: number;
  private frameInfoMap: Map<number, IframeInfo> = new Map();

  constructor(tabId: number) {
    this.tabId = tabId;
  }

  /**
   * すべてのフレームの情報を収集
   */
  async detectAllIframes(): Promise<IframeInfo[]> {
    const frames = await chrome.webNavigation.getAllFrames({
      tabId: this.tabId,
    });
    if (!frames) return [];

    // フレームの親子関係を構築
    const frameMap = new Map(frames.map((f) => [f.frameId, f]));

    // 各フレームの深さを計算
    const getDepth = (frameId: number): number => {
      const frame = frameMap.get(frameId);
      if (!frame || frame.parentFrameId === -1) return 0;
      return getDepth(frame.parentFrameId) + 1;
    };

    // 各フレームのパスを計算
    const getPath = (frameId: number): number[] => {
      const path: number[] = [];
      let currentId = frameId;
      while (currentId !== -1) {
        path.unshift(currentId);
        const frame = frameMap.get(currentId);
        if (!frame) break;
        currentId = frame.parentFrameId;
      }
      return path;
    };

    // 各フレームから位置情報を取得
    const iframeInfos: IframeInfo[] = [];

    for (const frame of frames) {
      try {
        const info = await this.getFrameInfo(
          frame.frameId,
          frame.parentFrameId,
          frame.url,
          getDepth(frame.frameId),
          getPath(frame.frameId),
        );
        if (info) {
          iframeInfos.push(info);
          this.frameInfoMap.set(frame.frameId, info);
        }
      } catch (error) {
        console.error(`Failed to get info for frame ${frame.frameId}:`, error);
      }
    }

    return iframeInfos;
  }

  /**
   * 特定のフレームの情報を取得
   */
  private async getFrameInfo(
    frameId: number,
    parentFrameId: number,
    url: string,
    depth: number,
    path: number[],
  ): Promise<IframeInfo | null> {
    try {
      // フレーム内でスクリプトを実行して情報を収集
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: this.tabId, frameIds: [frameId] },
        func: this.collectFrameInfo,
        args: [frameId],
      });

      if (!result || !result.result) return null;

      const { rect, profilePairs, origin } = result.result;

      return {
        frameId,
        parentFrameId,
        rect,
        profilePairs,
        origin,
        url,
        depth,
        path,
      };
    } catch (error) {
      console.error(`Error collecting frame info for ${frameId}:`, error);
      return null;
    }
  }

  /**
   * フレーム内で実行される情報収集関数
   */
  private collectFrameInfo(frameId: number): {
    rect: DOMRect;
    profilePairs: SafeProfilePair[];
    origin: string;
  } | null {
    try {
      // フレームの位置を取得
      let rect: DOMRect;

      if (window.self === window.top) {
        // トップレベルフレーム
        rect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
      } else {
        // iframe内の場合、親フレームに位置を問い合わせる
        rect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);

        // TODO: 親フレームとの通信を実装
        window.parent.postMessage(
          {
            type: "iframe-position-request",
            frameId,
          } as IframePositionMessage,
          "*",
        );
      }

      // プロファイルペアを収集
      // TODO: プロファイルペア収集ロジックを実装
      const profilePairs: SafeProfilePair[] = [];

      // TODO: プロファイルペア収集ロジックを実装
      // const elements = document.querySelectorAll('[data-profile]');
      // elements.forEach(el => { ... });

      return {
        rect,
        profilePairs,
        origin: window.origin,
      };
    } catch (error) {
      console.error("Error in collectFrameInfo:", error);
      return null;
    }
  }

  /**
   * iframe要素の実際の位置を計算
   */
  async calculateIframePositions(): Promise<void> {
    // 親フレームでiframe要素の位置を特定
    await chrome.scripting.executeScript({
      target: { tabId: this.tabId, frameIds: [0] }, // メインフレーム
      func: this.identifyIframePositions,
      args: [Array.from(this.frameInfoMap.values())],
    });
  }

  /**
   * メインフレームでiframe要素の位置を特定
   */
  private identifyIframePositions(iframeInfos: IframeInfo[]): void {
    const iframes = document.querySelectorAll("iframe");

    // 各iframeの位置を取得
    iframes.forEach((iframe) => {
      try {
        const rect = iframe.getBoundingClientRect();

        // postMessageでiframe内に位置情報を送信
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: "iframe-position-response",
              rect: {
                x: rect.x + window.scrollX,
                y: rect.y + window.scrollY,
                width: rect.width,
                height: rect.height,
                top: rect.top + window.scrollY,
                right: rect.right + window.scrollX,
                bottom: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
              },
            } as IframePositionMessage,
            "*",
          );
        }
      } catch (error) {
        console.error("Error identifying iframe position:", error);
      }
    });
  }

  /**
   * フレーム情報をツリー構造に変換
   */
  buildFrameTree(iframes: IframeInfo[]): IframeTree | null {
    const frameMap = new Map(iframes.map((f) => [f.frameId, f]));
    const rootFrames = iframes.filter((f) => f.parentFrameId === -1);

    if (rootFrames.length === 0) return null;

    const buildTree = (frameInfo: IframeInfo): IframeTree => {
      const children = iframes
        .filter((f) => f.parentFrameId === frameInfo.frameId)
        .map((child) => buildTree(child));

      return {
        info: frameInfo,
        children,
      };
    };

    const rootFrame = rootFrames[0];
    if (!rootFrame) return null;

    return buildTree(rootFrame);
  }

  /**
   * 特定のフレームに対してオーバーレイを表示するための情報を取得
   */
  getOverlayInfo(frameId: number): IframeInfo | undefined {
    return this.frameInfoMap.get(frameId);
  }

  /**
   * すべてのフレーム情報をクリア
   */
  clear(): void {
    this.frameInfoMap.clear();
  }
}
