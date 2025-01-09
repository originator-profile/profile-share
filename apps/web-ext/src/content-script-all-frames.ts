import { stringifyWithError } from "@originator-profile/core";
import {
  fetchCredentials,
  FetchCredentialSetResult,
} from "@originator-profile/presentation";
import { extractBody, verifyIntegrity } from "@originator-profile/verify";
import {
  credentialsMessenger,
  FetchCredentialsMessageResult,
  FrameLocation,
} from "./components/credentials";
import {
  ContentScriptAllFramesMessageRequest,
  ContentScriptAllFramesMessageResponse,
} from "./types/message";
import "./utils/cors-basic-auth";

async function handleMessageResponse(
  message: ContentScriptAllFramesMessageRequest,
): Promise<ContentScriptAllFramesMessageResponse> {
  switch (message.type) {
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
  void handleMessageResponse(message).then(
    (response) => response && sendResponse(response),
  );
  return true;
});

const toFetchCredentialsMessageResult = <T>(
  result: FetchCredentialSetResult<T>,
): FetchCredentialsMessageResult<T> => {
  const ok = !(result instanceof Error);
  if (!ok) {
    return {
      ok,
      error: stringifyWithError(result),
    };
  }
  return {
    ok,
    data: result,
  };
};

credentialsMessenger.onMessage("fetchCredentials", async () => {
  const { ops, cas } = await fetchCredentials(document);
  const frameLocation: FrameLocation = {
    origin: window.origin,
    url: window.location.href,
  };
  return {
    ops: toFetchCredentialsMessageResult(ops),
    cas: toFetchCredentialsMessageResult(cas),
    ...frameLocation,
  };
});

credentialsMessenger.onMessage("verifyIntegrity", async ({ data }) => {
  const [content] = data;
  const result = await verifyIntegrity(content);
  return result;
});
