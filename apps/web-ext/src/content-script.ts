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
const iframe = initialize();

async function handleMessageResponse(
  message: ContentScriptMessageRequest,
): Promise<ContentScriptMessageResponse | void> {
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
      activate(iframe);
      profiles = message.profiles;
      activeDp = message.activeDp;
      iframe.contentWindow?.postMessage({
        type: "enter-overlay",
        profiles,
        activeDp,
      });
      return {
        type: "overlay-profiles",
      };
    case "close-window":
      iframe.contentWindow?.postMessage({ type: "leave-overlay" });
      return {
        type: "close-window",
      };
  }
}

chrome.runtime.onMessage.addListener(function (
  message: ContentScriptMessageRequest,
  _,
  sendResponse: (response: ContentScriptMessageResponse | void) => void,
): true /* NOTE: Chrome の場合、Promise には非対応 */ {
  handleMessageResponse(message).then(
    (response) => response && sendResponse(response),
  );
  return true;
});

function handlePostMessageResponse(event: ContentWindowPostMessageEvent) {
  if (event.origin !== window.location.origin) return;
  switch (event.data.type) {
    case "enter-overlay":
      event.source?.postMessage({
        type: "enter-overlay",
        profiles,
        activeDp,
      });
      break;
    case "leave-overlay":
      deactivate(iframe);
      break;
    case "select-overlay-dp":
      chrome.runtime.sendMessage(event.data);
      break;
  }
}

window.addEventListener("message", handlePostMessageResponse);
