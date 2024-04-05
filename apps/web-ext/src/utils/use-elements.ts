import { useState, useEffect } from "react";
import { DocumentProfile } from "@originator-profile/ui";

/** CSS セレクターで指定した要素を返すフック関数 */
function useElements(dp: DocumentProfile | DocumentProfile[]) {
  const dps = [dp].flat();
  const locations = dps.flatMap((dp) => dp.listLocationsInTopLevel());
  const selector = locations.join(", ") || ":not(*)";
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
        attributeFilter: [DocumentProfile.DATASET_ATTRIBUTE],
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
