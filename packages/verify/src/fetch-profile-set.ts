import { NodeObject } from "jsonld";

/**
 * 文書内のapplication/ld+json NodeObjectの取得
 * @param doc Document オブジェクト
 */
export function getJsonLdNodeObjects(doc: Document = document): NodeObject[] {
  const elements = [
    ...doc.querySelectorAll(`script[type="application/ld+json"]`),
  ];
  const nodeObj = elements
    .map((elem) => {
      const text = elem.textContent;
      if (typeof text !== "string") {
        return undefined;
      }
      try {
        const jsonld = JSON.parse(text);
        return jsonld as NodeObject;
      } catch (e: unknown) {
        return undefined;
      }
    })
    .filter((e) => typeof e !== "undefined") as NodeObject[];

  return nodeObj;
}
