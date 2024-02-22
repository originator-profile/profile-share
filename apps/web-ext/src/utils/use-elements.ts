import { useState, useEffect } from "react";
import { Dp } from "@originator-profile/ui/src/types";
import { isDpLocator } from "../utils/dp-locator";

/** CSS セレクターで指定した要素を返すフック関数 */
function useElements(dp: Dp | Dp[]) {
  const dps = [dp].flat();
  const locations = dps
    .filter((dp) => dp.containTopLevelFrame)
    .flatMap((dp) => dp.item.filter(isDpLocator))
    .map((dpLocator) => dpLocator.location ?? ":root");
  const iframeLocations = dps
    .filter((dp) => !dp.containTopLevelFrame)
    .map((dp) => `iframe[data-document-profile-subjects~="${dp.subject}"]`);
  const selector = locations.concat(iframeLocations).join(", ") || ":not(*)";
  const [elements, setElements] = useState<HTMLElement[]>([]);
  useEffect(() => {
    const updateElements = () => {
      setElements(
        Array.from(window.parent.document.querySelectorAll(selector)),
      );
    };
    const observer = new MutationObserver(updateElements);
    const iframes = window.parent.document.getElementsByTagName("iframe");
    for (const iframe of iframes) {
      observer.observe(iframe, {
        attributes: true,
        attributeFilter: ["data-document-profile-subjects"],
      });
    }
    updateElements();
    return () => {
      observer.disconnect();
    };
  }, [setElements, selector]);
  return { elements };
}

export default useElements;
