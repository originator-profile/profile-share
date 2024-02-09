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
  switch (event.data.type) {
    case "descend-frame":
      for (let i = 0; i < window.frames.length; i++) {
        const contentWindow = window.frames[i];
        contentWindow?.postMessage(
          {
            type: "descend-frame",
          },
          "*",
        );
      }
      if (!data || data instanceof ProfilesFetchFailed) return;
      const { ad } = await expandProfilePairs(data);
      if (ad.length === 0) return;
      window.parent.postMessage(
        {
          type: "ascend-frame",
          ad,
        },
        "*",
      );
      break;
    case "ascend-frame":
      if (window.parent === window.top) {
        window.parent.postMessage(
          {
            type: "end-ascend-frame",
            ad: event.data.ad,
          },
          "*",
        );
      } else {
        window.parent.postMessage(event.data, "*");
      }
      break;
  }
}

window.addEventListener("message", handlePostMessageAllFramesResponse);
