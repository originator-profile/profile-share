import { useState, useEffect } from "react";

/** 交差中の要素を返すフック関数 */
function useIntersectingElements(
  elements: NodeListOf<Element>,
  options: IntersectionObserverInit = {}
) {
  const [intersectingElements, setIntersectingElements] = useState<Element[]>(
    []
  );
  useEffect(() => {
    const handler = (entries: IntersectionObserverEntry[]) => {
      setIntersectingElements(
        entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target)
      );
    };
    const observer = new IntersectionObserver(handler, options);
    for (const element of elements) {
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
    };
  }, [elements, options, options.threshold, options.root, options.rootMargin]);
  return {
    intersectingElements,
  };
}

export default useIntersectingElements;
