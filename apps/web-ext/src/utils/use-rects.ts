import { useMemo, useState, useEffect } from "react";
import { useEvent } from "react-use";
import { debounce } from "throttle-debounce";
import { DpText, DpVisibleText, DpHtml } from "@webdino/profile-model";
import useIntersectingElements from "./use-intersecting-elements";

/** 要素の寸法と相対位置を返すフック関数 */
function useRects(dpItem: DpText | DpVisibleText | DpHtml) {
  const elements = useMemo(
    () => window.parent.document.querySelectorAll(dpItem.location ?? ":not(*)"),
    [dpItem.location]
  );
  const { intersectingElements } = useIntersectingElements(elements);
  const [rects, setRects] = useState<DOMRect[]>([]);
  const handler = debounce(100, () => {
    setRects(
      intersectingElements.map((element) => element.getBoundingClientRect())
    );
  });
  useEvent("resize", handler, window.parent);
  useEvent("scroll", handler, window.parent);
  useEffect(() => {
    handler();
  }, [handler, intersectingElements]);
  return { rects };
}

export default useRects;
