import "./style.css";
import browser from "webextension-polyfill";
import { MessageRequest, MessageResponse } from "./types/message";
import { activate, deactivate } from "./utils/iframe";

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
      return Promise.resolve({
        type: "focus-profile",
      });
  }
}

browser.runtime.onMessage.addListener(handleMessageResponse);

function handlePostMessageResponse(event: MessageEvent) {
  switch (event.data.type) {
    case "blur-profile":
      deactivate();
      break;
  }
}

window.addEventListener("message", handlePostMessageResponse);
