import {
  extractBody,
  fetchProfileSet,
  expandProfilePairs,
  ProfilesFetchFailed,
} from "@originator-profile/verify";
import {
  ContentScriptAllFramesMessageRequest,
  ContentScriptAllFramesMessageResponse,
  AllFramesPostMessageEvent,
} from "./types/message";

let data: Awaited<ReturnType<typeof fetchProfileSet>>;

async function handleMessageResponse(
  message: ContentScriptAllFramesMessageRequest,
): Promise<ContentScriptAllFramesMessageResponse> {
  switch (message.type) {
    case "fetch-profiles": {
      data = await fetchProfileSet(document);
      return {
        type: "fetch-profiles",
        ok: !(data instanceof Error),
        data:
          data instanceof Error
            ? JSON.stringify(data, Object.getOwnPropertyNames(data))
            : JSON.stringify(data),
        origin: document.location.origin,
      };
    }
    case "extract-body": {
      const data = await extractBody(
        document.location.href,
        async (location) =>
          Array.from(document.querySelectorAll<HTMLElement>(location)),
        JSON.parse(message.dpLocator),
        !message.isAdvertisement,
      );
      return {
        type: "extract-body",
        ok: !(data instanceof Error),
        data:
          data instanceof Error
            ? JSON.stringify(data, Object.getOwnPropertyNames(data))
            : JSON.stringify(data),
        url: document.location.href,
      };
    }
  }
}

chrome.runtime.onMessage.addListener(function (
  message: ContentScriptAllFramesMessageRequest,
  _,
  sendResponse: (response: ContentScriptAllFramesMessageResponse) => void,
): true /* NOTE: Chrome の場合、Promise には非対応 */ {
  handleMessageResponse(message).then(
    (response) => response && sendResponse(response),
  );
  return true;
});

async function handlePostMessageAllFramesResponse(
  event: AllFramesPostMessageEvent,
) {
  const [origin] = (event.data.targetOrigins ?? []).slice(-1);
  if (event.origin !== origin) return;
  switch (event.data.type) {
    case "descend-frame": {
      const targetOrigins = [
        ...event.data.targetOrigins,
        window.location.origin,
      ];
      for (let i = 0; i < window.frames.length; i++) {
        const contentWindow = window.frames[i];
        contentWindow?.postMessage(
          {
            type: "descend-frame",
            targetOrigins,
          },
          "*",
        );
      }
      if (!data || data instanceof ProfilesFetchFailed) return;
      const { ad } = await expandProfilePairs(data);
      if (ad.length === 0) return;
      window.postMessage({
        type: "ascend-frame",
        ad,
        targetOrigins,
      });
      break;
    }
    case "ascend-frame":
      const [targetOrigin] = event.data.targetOrigins.slice(-2, -1);
      if (!targetOrigin) return;
      window.parent.postMessage(
        {
          type:
            window.parent === window.top ? "end-ascend-frame" : "ascend-frame",
          ad: event.data.ad,
          targetOrigins: event.data.targetOrigins.slice(0, -1),
        },
        targetOrigin,
      );
      break;
  }
}

window.addEventListener("message", handlePostMessageAllFramesResponse);
