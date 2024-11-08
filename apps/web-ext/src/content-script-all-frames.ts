import { stringifyWithError } from "@originator-profile/core";
import { fetchCredentials } from "@originator-profile/presentation";
import { extractBody } from "@originator-profile/verify";
import {
  ContentScriptAllFramesMessageRequest,
  ContentScriptAllFramesMessageResponse,
} from "./types/message";

async function handleMessageResponse(
  message: ContentScriptAllFramesMessageRequest,
): Promise<ContentScriptAllFramesMessageResponse> {
  switch (message.type) {
    case "fetch-profiles": {
      const data = await fetchCredentials(document);
      return {
        type: "fetch-profiles",
        ok: !(data instanceof Error),
        data: stringifyWithError(data),
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
        data: stringifyWithError(data),
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
