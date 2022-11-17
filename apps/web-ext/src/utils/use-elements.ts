import { useMemo } from "react";

/** CSS セレクターで指定した要素を返すフック関数 */
function useElements(location?: string | (string | undefined)[]) {
  const elements = useMemo<NodeListOf<HTMLElement>>(
    () =>
      window.parent.document.querySelectorAll(
        [location]
          .flat()
          .map((l) => l ?? ":root")
          .join(", ") || ":root"
      ),
    [location]
  );
  return { elements };
}

export default useElements;
