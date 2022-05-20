import browser from "webextension-polyfill";
import { MessageRequest, MessageResponse } from "./types/message";

function handleMessageResponse(
  message: MessageRequest
): Promise<MessageResponse> {
  switch (message.type) {
    case "op":
      return Promise.resolve({
        type: "op",
        targetOrigin: document.location.origin,
      });
  }
}

browser.runtime.onMessage.addListener(handleMessageResponse);
