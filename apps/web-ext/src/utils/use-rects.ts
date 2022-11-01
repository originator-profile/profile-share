import { useState, useEffect, startTransition } from "react";
import { useEvent } from "react-use";
import useIntersectingElements from "./use-intersecting-elements";

/** 要素の寸法と相対位置を返すフック関数 */
function useRects(elements: NodeListOf<HTMLElement>) {
  const { intersectingElements } = useIntersectingElements(elements);
  const [rects, setRects] = useState<DOMRect[]>([]);
  const handler = () => {
    startTransition(() => {
      setRects(
        intersectingElements.map((intersectingElement) =>
          intersectingElement.getBoundingClientRect()
        )
      );
    });
  };
  useEvent("resize", handler, window.parent);
  useEvent("scroll", handler, window.parent);
  useEffect(() => {
    startTransition(() => {
      setRects(
        intersectingElements.map((intersectingElement) =>
          intersectingElement.getBoundingClientRect()
        )
      );
    });
  }, [setRects, intersectingElements]);
  return { rects };
}

export default useRects;
