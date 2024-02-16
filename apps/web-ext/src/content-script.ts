import { fetchWebsiteProfilePair } from "@originator-profile/verify";
import { Profile, Dp } from "@originator-profile/ui/src/types";
import {
  ContentScriptMessageRequest,
  ContentScriptMessageResponse,
  ContentWindowPostMessageEvent,
} from "./types/message";
import { initialize, activate, deactivate } from "./utils/iframe";

let profiles: Profile[] = [];
let activeDp: Dp | null = null;
const overlay = initialize();

async function handleMessageResponse(
  message: ContentScriptMessageRequest,
): Promise<ContentScriptMessageResponse> {
  switch (message.type) {
    case "fetch-website-profile-pair": {
      const data = await fetchWebsiteProfilePair(document);
      return {
        type: "fetch-website-profile-pair",
        ok: !(data instanceof Error),
        data:
          data instanceof Error
            ? JSON.stringify(data, Object.getOwnPropertyNames(data))
            : JSON.stringify(data),
        origin: document.location.origin,
      };
    }
    case "overlay-profiles":
      activate(overlay);
      profiles = message.profiles;
      activeDp = message.activeDp;
      overlay.contentWindow?.postMessage({
        type: "enter-overlay",
        profiles,
        activeDp,
      });
      return {
        type: "overlay-profiles",
      };
    case "close-window":
      overlay.contentWindow?.postMessage({ type: "leave-overlay" });
      return {
        type: "close-window",
      };
  }
}

chrome.runtime.onMessage.addListener(function (
  message: ContentScriptMessageRequest,
  _,
  sendResponse: (response: ContentScriptMessageResponse) => void,
): true /* NOTE: Chrome の場合、Promise には非対応 */ {
  handleMessageResponse(message).then(
    (response) => response && sendResponse(response),
  );
  return true;
});

/* eslint complexity: ["off", { max: 13 }] -- TODO: 各メッセージハンドリング関数を外部化して */
function handlePostMessageResponse(event: ContentWindowPostMessageEvent) {
  switch (event.data.type) {
    case "enter-overlay":
      if (event.origin !== window.location.origin) return;
      event.source?.postMessage({
        type: "enter-overlay",
        profiles,
        activeDp,
      });
      window.postMessage({
        type: "descend-frame",
        targetOrigins: [window.location.origin],
      });
      break;
    case "leave-overlay":
      if (event.origin !== window.location.origin) return;
      deactivate(overlay);
      break;
    case "select-overlay-dp":
      if (event.origin !== window.location.origin) return;
      chrome.runtime.sendMessage(event.data);
      break;
    case "end-ascend-frame": {
      if (event.data.targetOrigins.at(-1) !== window.location.origin) return;
      const iframe = Array.from(document.getElementsByTagName("iframe")).find(
        (iframe) => iframe.contentWindow === event.source,
      );
      if (!iframe) return;
      iframe.dataset.documentProfileSubjects = Array.from(
        new Set(
          (iframe.dataset.documentsProfileSubjects ?? "")
            .split(" ")
            .concat(event.data.ad.map(({ dp }) => dp.sub)),
        ),
      ).join(" ");
      overlay.contentWindow?.postMessage({ type: "update-overlay" });
      break;
    }
  }
}

window.addEventListener("message", handlePostMessageResponse);
