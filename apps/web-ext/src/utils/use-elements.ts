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
  const selector = [...locations, ...iframeLocations].join(", ") || ":not(*)";
  const [update, setUpdate] = useState<UpdateOverlayMessage | null>(null);
  function handleMessage(event: IFramePostMessageEvent) {
    if (event.origin !== window.parent.location.origin) return;
    switch (event.data.type) {
      case "update-overlay":
        setUpdate(event.data);
        break;
    }
  }
  useEvent("message", handleMessage);
  const elements = useMemo<NodeListOf<HTMLElement>>(
    () => window.parent.document.querySelectorAll(selector),
    [location, update],
  );
  return { elements };
}

export default useElements;
