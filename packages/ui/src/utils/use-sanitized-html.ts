import DOMPurify from "dompurify";

/** HTML文字列をサニタイズするカスタムフック */
export default function useSanitizedHtml(
  dangerousHtml?: string,
): string | undefined {
  if (dangerousHtml === undefined) return;
  const parser = new DOMParser();
  const descriptionDocument = parser.parseFromString(
    dangerousHtml,
    "text/html",
  );
  for (const anchor of descriptionDocument.getElementsByTagName("a")) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  return DOMPurify.sanitize(descriptionDocument.body.innerHTML);
}
