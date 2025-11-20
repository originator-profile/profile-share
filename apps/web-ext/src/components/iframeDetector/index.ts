export * from "./types";
export * from "./detector";
export * from "./messenger";
export * from "./tracker";

// 便利な統合関数
import { IframeDetector } from "./detector";
import { IframeTracker } from "./tracker";
import { iframeMessenger } from "./messenger";
import { IframeInfo, IframeTree } from "./types";

/**
 * iframe検出システムの初期化と管理
 */
export class IframeDetectionSystem {
  private detector: IframeDetector | null = null;
  private tracker: IframeTracker | null = null;
  private tabId: number | null = null;

  /**
   * システムの初期化
   */
  async initialize(tabId: number): Promise<void> {
    this.tabId = tabId;
    this.detector = new IframeDetector(tabId);

    // コンテンツスクリプト内でのみトラッカーを初期化
    if (typeof window !== "undefined" && window.document) {
      this.tracker = new IframeTracker();
    }
  }

  /**
   * すべてのiframeを検出して情報を収集
   */
  async detectAllIframes(): Promise<{
    iframes: IframeInfo[];
    tree: IframeTree | null;
  }> {
    if (!this.detector) {
      throw new Error("System not initialized");
    }

    const iframes = await this.detector.detectAllIframes();
    const tree = this.detector.buildFrameTree(iframes);

    // iframe情報を同期
    iframeMessenger.syncIframeInfo(iframes);

    return { iframes, tree };
  }

  /**
   * iframe位置の更新
   */
  async updatePositions(): Promise<Map<number, DOMRect>> {
    if (!this.tracker) {
      return new Map();
    }

    return this.tracker.updateAllPositions();
  }

  /**
   * 特定のframeIdのiframe情報を取得
   */
  getFrameInfo(frameId: number): IframeInfo | undefined {
    if (!this.detector) return undefined;
    return this.detector.getOverlayInfo(frameId);
  }

  /**
   * iframe要素が表示領域内にあるかチェック
   */
  isInViewport(frameId: number): boolean {
    if (!this.tracker) return false;
    return this.tracker.isIframeInViewport(frameId);
  }

  /**
   * クリーンアップ
   */
  cleanup(): void {
    if (this.detector) {
      this.detector.clear();
    }
    if (this.tracker) {
      this.tracker.cleanup();
    }
    iframeMessenger.cleanup();
  }
}

// シングルトンインスタンス
export const iframeDetectionSystem = new IframeDetectionSystem();
