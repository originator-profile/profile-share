import { useMemo } from "react";

/** CSS セレクターで指定した要素を返すフック関数 */
function useElements(location?: string | (string | undefined)[]) {
  const elements = useMemo<NodeListOf<HTMLElement>>(
    () =>
      window.parent.document.querySelectorAll(
        (location instanceof Array
          ? location.filter(Boolean).join(", ")
          : location) || ":root"
      ),
    [location]
  );
  return { elements };
}

export default useElements;
