import { ProfilePair } from "@originator-profile/verify";
import { IframeInfo, IframePositionMessage, IframeSyncMessage, SafeProfilePair } from "./types";

/**
 * iframe間の通信を管理するクラス
 */
export class IframeMessenger {
  private listeners: Map<string, (event: MessageEvent) => void> = new Map();
  private frameInfo: IframeInfo | null = null;

  constructor() {
    this.setupMessageHandler();
  }

  /**
   * メッセージハンドラーのセットアップ
   */
  private setupMessageHandler(): void {
    const handler = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      const { type } = event.data;
      const listener = this.listeners.get(type);
      if (listener) {
        listener(event);
      }
    };

    window.addEventListener("message", handler);
  }

  /**
   * メッセージリスナーの登録
   */
  on(type: string, callback: (event: MessageEvent) => void): void {
    this.listeners.set(type, callback);
  }

  /**
   * メッセージリスナーの削除
   */
  off(type: string): void {
    this.listeners.delete(type);
  }

  /**
   * iframe位置情報のリクエストを送信
   */
  requestPosition(frameId: number): Promise<DOMRect | null> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.off("iframe-position-response");
        resolve(null);
      }, 1000);

      this.on("iframe-position-response", (event: MessageEvent) => {
        const data = event.data as IframePositionMessage;
        if (data.frameId === frameId && data.rect) {
          clearTimeout(timeout);
          this.off("iframe-position-response");
          resolve(data.rect);
        }
      });

      window.parent.postMessage({
        type: "iframe-position-request",
        frameId
      } as IframePositionMessage, "*");
    });
  }

  /**
   * iframe位置情報の応答を送信
   */
  respondPosition(targetWindow: Window, frameId: number, rect: DOMRect): void {
    targetWindow.postMessage({
      type: "iframe-position-response",
      frameId,
      rect
    } as IframePositionMessage, "*");
  }

  /**
   * iframe情報の同期
   */
  syncIframeInfo(iframes: IframeInfo[]): void {
    // すべてのフレームに情報を配信
    const message: IframeSyncMessage = {
      type: "iframe-sync",
      iframes
    };

    // トップレベルウィンドウに送信
    if (window.top) {
      window.top.postMessage(message, "*");
    }

    // すべてのiframeに送信
    const allIframes = document.querySelectorAll("iframe");
    allIframes.forEach((iframe) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      }
    });
  }

  /**
   * iframe情報の同期を受信
   */
  onSyncReceived(callback: (iframes: IframeInfo[]) => void): void {
    this.on("iframe-sync", (event: MessageEvent) => {
      const data = event.data as IframeSyncMessage;
      if (data.type === "iframe-sync" && data.iframes) {
        callback(data.iframes);
      }
    });
  }

  /**
   * 現在のフレーム情報を設定
   */
  setFrameInfo(info: IframeInfo): void {
    this.frameInfo = info;
  }

  /**
   * 現在のフレーム情報を取得
   */
  getFrameInfo(): IframeInfo | null {
    return this.frameInfo;
  }

  /**
   * プロファイルペアの更新を通知
   */
  notifyProfileUpdate(profilePairs: SafeProfilePair[]): void {
    if (!this.frameInfo) return;

    const updatedInfo: IframeInfo = {
      ...this.frameInfo,
      profilePairs
    };

    // 親ウィンドウに通知
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: "profile-update",
        frameInfo: updatedInfo
      }, "*");
    }
  }

  /**
   * クリーンアップ
   */
  cleanup(): void {
    this.listeners.clear();
    window.removeEventListener("message", () => {});
  }
}

// シングルトンインスタンス
export const iframeMessenger = new IframeMessenger();
