import { useMemo, useState, useEffect } from "react";
import { useEvent } from "react-use";
import { useThrottledCallback } from "use-debounce";
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
  const handler = useThrottledCallback(() => {
    setRects(
      intersectingElements.map((element) => element.getBoundingClientRect())
    );
  }, 10);
  useEvent("resize", handler, window.parent);
  useEvent("scroll", handler, window.parent);
  useEffect(() => {
    handler();
    // NOTE: オーバーレイの初期状態（リサイズ、スクロール前）でマーカーが表示されないことへの対処
  }, [handler, intersectingElements]);
  return { rects };
}

export default useRects;
