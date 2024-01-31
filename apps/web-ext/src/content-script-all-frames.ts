import { fetchProfileSet } from "@originator-profile/verify";
import {
  ContentScriptMessageRequest,
  ContentScriptMessageResponse,
} from "./types/message";

async function handleMessageResponse(
  message: ContentScriptMessageRequest,
): Promise<ContentScriptMessageResponse | void> {
  switch (message.type) {
    case "fetch-profiles": {
      const data = await fetchProfileSet(document);
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
