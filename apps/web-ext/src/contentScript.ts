import browser from "webextension-polyfill";
import { MessageRequest, MessageResponse } from "./types/message";

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
  }
}

browser.runtime.onMessage.addListener(handleMessageResponse);
