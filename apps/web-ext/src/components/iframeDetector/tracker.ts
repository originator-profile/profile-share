import { IframeInfo } from "./types";

/**
 * iframe要素とフレーム情報を関連付けるクラス
 */
export class IframeTracker {
  private iframeMap: WeakMap<HTMLIFrameElement, IframeInfo> = new WeakMap();
  private frameIdToElement: Map<number, HTMLIFrameElement> = new Map();
  private observer: MutationObserver | null = null;

  constructor() {
    this.setupObserver();
  }

  /**
   * DOMの変更を監視
   */
  private setupObserver(): void {
    const startObserving = () => {
      if (this.observer || !document.body) return;

      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 追加されたノードをチェック
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLIFrameElement) {
              this.trackIframe(node);
            }
          });

          // 削除されたノードをチェック
          mutation.removedNodes.forEach((node) => {
            if (node instanceof HTMLIFrameElement) {
              this.untrackIframe(node);
            }
          });
        });
      });

      // 監視を開始
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // 既存のiframeを追跡
      this.trackExistingIframes();
    };

    // DOMContentLoadedで監視を開始
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserving);
    } else {
      // すでに読み込まれている場合はすぐに開始
      startObserving();
    }
  }

  /**
   * 既存のiframe要素を追跡
   */
  private trackExistingIframes(): void {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => this.trackIframe(iframe));
  }

  /**
   * iframe要素を追跡
   */
  private trackIframe(iframe: HTMLIFrameElement): void {
    // iframeのcontentWindowからframeIdを特定する処理
    // TODO: chrome.webNavigation APIと連携が必要
    this.identifyFrameId(iframe);
  }

  /**
   * iframe要素の追跡を解除
   */
  private untrackIframe(iframe: HTMLIFrameElement): void {
    const info = this.iframeMap.get(iframe);
    if (info) {
      this.frameIdToElement.delete(info.frameId);
      this.iframeMap.delete(iframe);
    }
  }

  /**
   * iframe要素のframeIdを特定
   */
  private async identifyFrameId(iframe: HTMLIFrameElement): Promise<void> {
    try {
      // contentWindowのURLと一致するフレームを探す
      const contentWindow = iframe.contentWindow;
      if (!contentWindow) return;

      // タイムスタンプを使った一意の識別子を生成
      const identifier = `iframe-${Date.now()}-${Math.random()}`;

      // iframe内にマーカーを設置
      try {
        // @ts-ignore
        contentWindow.__frameIdentifier = identifier;
      } catch (e) {
        // クロスオリジンの場合はアクセスできない
        return;
      }

      // chrome.webNavigation.getAllFramesを使用してフレームを特定
      // TODO: バックグラウンドスクリプトとの通信が必要
    } catch (error) {
      console.error("Error identifying frame ID:", error);
    }
  }

  /**
   * フレーム情報をiframe要素に関連付け
   */
  associateFrameInfo(iframe: HTMLIFrameElement, frameInfo: IframeInfo): void {
    this.iframeMap.set(iframe, frameInfo);
    this.frameIdToElement.set(frameInfo.frameId, iframe);
  }

  /**
   * frameIdからiframe要素を取得
   */
  getIframeElement(frameId: number): HTMLIFrameElement | undefined {
    return this.frameIdToElement.get(frameId);
  }

  /**
   * iframe要素からフレーム情報を取得
   */
  getFrameInfo(iframe: HTMLIFrameElement): IframeInfo | undefined {
    return this.iframeMap.get(iframe);
  }

  /**
   * すべてのiframe要素の位置を更新
   */
  updateAllPositions(): Map<number, DOMRect> {
    const positions = new Map<number, DOMRect>();

    this.frameIdToElement.forEach((iframe, frameId) => {
      const rect = iframe.getBoundingClientRect();
      const absoluteRect = new DOMRect(
        rect.x + window.scrollX,
        rect.y + window.scrollY,
        rect.width,
        rect.height
      );
      positions.set(frameId, absoluteRect);
    });

    return positions;
  }

  /**
   * 特定のiframe要素の位置を取得
   */
  getIframePosition(frameId: number): DOMRect | null {
    const iframe = this.frameIdToElement.get(frameId);
    if (!iframe) return null;

    const rect = iframe.getBoundingClientRect();
    return new DOMRect(
      rect.x + window.scrollX,
      rect.y + window.scrollY,
      rect.width,
      rect.height
    );
  }

  /**
   * iframe要素が表示領域内にあるかチェック
   */
  isIframeInViewport(frameId: number): boolean {
    const iframe = this.frameIdToElement.get(frameId);
    if (!iframe) return false;

    const rect = iframe.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  /**
   * クリーンアップ
   */
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.frameIdToElement.clear();
  }
}
