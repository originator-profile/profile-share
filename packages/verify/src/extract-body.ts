import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";

type Type = (DpVisibleText | DpText | DpHtml)["type"];

function extract(element: HTMLElement, type: Type): string {
  switch (type) {
    case "visibleText":
      return element.innerText;
    case "text":
      return element.textContent ?? "";
    case "html":
      return element.outerHTML;
  }
}

/** 対象の要素とその子孫にあたる文字列の抽出 */
export function extractBody(
  elements: NodeListOf<HTMLElement>,
  type: Type
): string {
  return Array.from(elements)
    .map((element) => extract(element, type))
    .join("");
}
