import { useMemo } from "react";
import { DpLocator } from "../types/profile";

/** CSS セレクターで指定した要素を返すフック関数 */
function useElements(location: DpLocator["location"]) {
  const elements = useMemo<NodeListOf<HTMLElement>>(
    () => window.parent.document.querySelectorAll(location ?? ":root"),
    [location]
  );
  return { elements };
}

export default useElements;
