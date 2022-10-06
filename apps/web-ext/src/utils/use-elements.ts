import { useMemo } from "react";

/** CSS セレクターで指定した要素を返すフック関数 */
function useElements(location?: string) {
  const elements = useMemo<NodeListOf<HTMLElement>>(
    () => window.parent.document.querySelectorAll(location ?? ":root"),
    [location]
  );
  return { elements };
}

export default useElements;
