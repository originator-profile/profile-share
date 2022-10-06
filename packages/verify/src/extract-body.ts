import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";
import { ProfileBodyExtractFailed } from "./errors";

type DpItem = DpVisibleText | DpText | DpHtml;

function extract(element: HTMLElement, type: DpItem["type"]): string {
  switch (type) {
    case "visibleText":
      return element.innerText;
    case "text":
      return element.textContent ?? "";
    case "html":
      return element.outerHTML;
  }
}

/**
 * 対象の要素とその子孫にあたる文字列の抽出
 * @param document Document インターフェイス
 * @param item dp クレームの item プロパティの visibleText 型あるいは text 型あるいは html 型オブジェクト
 * @returns 抽出した文字列
 */
export function extractBody(document: Document, item: DpItem) {
  if (!document.location.href.startsWith(item.url))
    return new ProfileBodyExtractFailed("URL mismatch");
  const elements = document.querySelectorAll<HTMLElement>(
    item.location ?? ":root"
  );
  return Array.from(elements)
    .map((element) => extract(element, item.type))
    .join("");
}
