import { DpLocator } from "@originator-profile/core";
import { ProfileBodyExtractFailed } from "./errors";
import { Locator } from "playwright";

type Locale = HTMLElement | Locator;

/**
 * テキストを抽出する関数
 */
function extractor(
  locale: Locale,
  attribute: "innerText" | "textContent" | "outerHTML",
): Promise<string> {
  if ("evaluate" in locale)
    return locale.evaluate((el, attribute) => {
      return "ownerSVGElement" in el ? "" : el[attribute] ?? "";
    }, attribute);
  return Promise.resolve(locale[attribute] ?? "");
}

/**
 * 対象の要素とその子孫にあたる文字列の抽出
 * @pageUrl 抽出対象の URL
 * @param locator 対象とする要素を特定する関数
 * @param item 署名を除いた dp クレームの item プロパティの visibleText 型あるいは text 型あるいは html 型オブジェクト
 * @param urlRequired item の中に url プロパティがない場合にエラーするかどうか
 * @returns 抽出した文字列
 * @remarks
 * レンダリングされたテキストか否かを HTMLElement.innerText の実装に委ねているため、Web ブラウザ以外の環境における visibleText 型での文字列の抽出には使用しないでください。
 */
export async function extractBody<T extends Locale>(
  pageUrl: string,
  locator: (location: Extract<DpLocator["location"], string>) => Promise<T[]>,
  item: Omit<DpLocator, "proof">,
  urlRequired = true,
) {
  if (urlRequired && !item.url) {
    throw new ProfileBodyExtractFailed("URL missing");
  }
  if (item.url && new URL(pageUrl).href !== new URL(item.url).href) {
    return new ProfileBodyExtractFailed("URL mismatch");
  }

  const locales = await locator(item.location ?? ":root");
  const attribute = {
    visibleText: "innerText",
    text: "textContent",
    html: "outerHTML",
  } as const;
  const result = await Promise.all(
    locales.map((locale) => extractor(locale, attribute[item.type])),
  );
  return result.join("");
}
