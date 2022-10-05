import { DpLocator } from "../types/profile";

function extract(element: Element, type: DpLocator["type"]): string {
  switch (type) {
    case "visibleText":
      return element.innerHTML;
    case "text":
      return element.textContent ?? "";
    case "html":
      return element.outerHTML;
  }
}

/** 対象の要素とその子孫にあたる文字列の抽出 */
function extractBody(
  elements: NodeListOf<Element>,
  type: DpLocator["type"]
): string {
  return Array.from(elements)
    .map((element) => extract(element, type))
    .join("");
}

export default extractBody;
