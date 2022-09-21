import {
  MessageRequest,
  MessageResponse,
  ContentWindowPostMessageEvent,
} from "./types/message";
import { activate, deactivate } from "./utils/iframe";
import { Profile } from "./types/profile";

let profile: Profile | null = null;
const iframe = document.createElement("iframe");

function handleMessageResponse(
  message: MessageRequest
): Promise<MessageResponse> {
  switch (message.type) {
    case "fetch-profiles":
      return Promise.resolve({
        type: "fetch-profiles",
        targetOrigin: document.location.origin,
        profilesLink:
          document
            .querySelector('link[rel="alternate"][type="application/ld+json"]')
            ?.getAttribute("href") ?? null,
      });
    case "focus-profile":
      activate(iframe);
      profile = message.profile;
      return Promise.resolve({
        type: "focus-profile",
      });
    case "close-window":
      iframe.contentWindow?.postMessage({ type: "leave-overlay" });
      return Promise.resolve({
        type: "close-window",
      });
  }
}

chrome.runtime.onMessage.addListener(async function (
  message: MessageRequest,
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
        profile,
      });
      break;
    case "leave-overlay":
      deactivate(iframe);
      break;
  }
}

window.addEventListener("message", handlePostMessageResponse);
