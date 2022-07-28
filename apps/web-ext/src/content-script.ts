import browser from "webextension-polyfill";
import {
  MessageRequest,
  MessageResponse,
  PostMessageRequestEvent,
} from "./types/message";
import { activate, deactivate } from "./utils/iframe";
import { Profile } from "./types/profile";

let profile: Profile | null = null;

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
      activate();
      profile = message.profile;
      return Promise.resolve({
        type: "focus-profile",
      });
  }
}

browser.runtime.onMessage.addListener(handleMessageResponse);

function handlePostMessageResponse(event: PostMessageRequestEvent) {
  if (event.origin !== window.location.origin) return;
  switch (event.data.type) {
    case "enter-overlay":
      event.source?.postMessage({
        type: "enter-overlay",
        profile,
      });
      break;
    case "leave-overlay":
      deactivate();
      break;
  }
}

window.addEventListener("message", handlePostMessageResponse);
