import { useState, useEffect } from "react";

/** 交差中か判定するフック関数 */
function useIntersection(
  element: HTMLElement,
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  useEffect(() => {
    const handler = (entries: IntersectionObserverEntry[]) => {
      setIsIntersecting(entries.some((entry) => entry.isIntersecting));
    };
    const observer = new IntersectionObserver(handler, {
      threshold: options.threshold ?? [0, 1],
      root: options.root,
      rootMargin: options.rootMargin,
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element, options.threshold, options.root, options.rootMargin]);
  return {
    isIntersecting,
  };
}

export default useIntersection;
