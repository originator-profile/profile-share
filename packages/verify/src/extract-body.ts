import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";
import { ProfileBodyExtractFailed } from "./errors";

type DpItem = DpVisibleText | DpText | DpHtml;

/**
 * 対象の要素とその子孫にあたる文字列の抽出
 * @pageUrl 抽出対象の URL
 * @param locator 対象とする要素を特定する関数
 * @param extractor 文字列を抽出する関数
 * @param item 署名を除いた dp クレームの item プロパティの visibleText 型あるいは text 型あるいは html 型オブジェクト
 * @returns 抽出した文字列
 * @remarks
 * レンダリングされたテキストか否かを HTMLElement.innerText の実装に委ねているため、Web ブラウザ以外の環境における visibleText 型での文字列の抽出には使用しないでください。
 */
export async function extractBody<T>(
  pageUrl: string,
  locator: (location: Extract<DpItem["location"], string>) => T,
  extractor: (match: T, type: DpItem["type"]) => Promise<string[]>,
  { url, location, type }: Omit<DpItem, "proof">
) {
  if (new URL(pageUrl).href !== new URL(url).href)
    return new ProfileBodyExtractFailed("URL mismatch");
  const l = locator(location ?? ":root");
  const result = await extractor(l, type);
  return result.join("");
}
