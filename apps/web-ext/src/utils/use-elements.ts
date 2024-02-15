import { useState, useMemo } from "react";
import { useEvent } from "react-use";
import { Dp } from "@originator-profile/ui/src/types";
import { UpdateOverlayMessage, IFramePostMessageEvent } from "../types/message";
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
  const [iframeReady, setIframeReady] = useState<UpdateOverlayMessage>();
  function handleMessage(event: IFramePostMessageEvent) {
    if (event.origin !== window.parent.location.origin) return;
    switch (event.data.type) {
      case "update-overlay":
        setIframeReady(event.data);
        break;
    }
  }
  useEvent("message", handleMessage);
  const elements = useMemo<NodeListOf<HTMLElement>>(() => {
    const selector =
      locations.concat(iframeReady ? iframeLocations : []).join(", ") ||
      ":not(*)";
    return window.parent.document.querySelectorAll(selector);
  }, [locations, iframeLocations, iframeReady]);
  return { elements };
}

export default useElements;
