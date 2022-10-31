import {
  ContentScriptMessageRequest,
  ContentScriptMessageResponse,
  ContentWindowPostMessageEvent,
} from "./types/message";
import { initialize, activate, deactivate } from "./utils/iframe";
import { Profile, Dp } from "./types/profile";

let profiles: Profile[] = [];
let activeDp: Dp | null = null;
const iframe = initialize();

function handleMessageResponse(
  message: ContentScriptMessageRequest
): Promise<ContentScriptMessageResponse> {
  switch (message.type) {
    case "fetch-profiles": {
      const link = document
        .querySelector('link[rel="alternate"][type="application/ld+json"]')
        ?.getAttribute("href");
      return Promise.resolve({
        type: "fetch-profiles",
        profileEndpoint:
          link ?? `${document.location.origin}/.well-known/op-document`,
      });
    }
    case "overlay-profiles":
      activate(iframe);
      profiles = message.profiles;
      activeDp = message.activeDp;
      return Promise.resolve({
        type: "overlay-profiles",
      });
    case "close-window":
      iframe.contentWindow?.postMessage({ type: "leave-overlay" });
      return Promise.resolve({
        type: "close-window",
      });
  }
}

chrome.runtime.onMessage.addListener(async function (
  message: ContentScriptMessageRequest,
  _,
  sendResponse
) {
  const response = await handleMessageResponse(message);
  sendResponse(response);
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
