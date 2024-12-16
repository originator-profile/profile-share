import { stringifyWithError } from "@originator-profile/core";
import {
  fetchWebsiteProfilePair,
  fetchSiteProfile,
} from "@originator-profile/verify";
import {
  ProfilePayloadWithMetadata,
  DpPayloadWithMetadata,
} from "@originator-profile/ui";
import {
  ContentScriptMessageRequest,
  ContentScriptMessageResponse,
  ContentWindowPostMessageEvent,
} from "./types/message";
import { initialize, activate, deactivate } from "./utils/iframe";
import { siteProfileMessenger } from "./components/siteProfile";

let profiles: ProfilePayloadWithMetadata[] = [];
let websiteProfiles: ProfilePayloadWithMetadata[] = [];
let activeDp: DpPayloadWithMetadata | null = null;
const overlay = initialize();

async function handleMessageResponse(
  message: ContentScriptMessageRequest,
): Promise<ContentScriptMessageResponse> {
  switch (message.type) {
    case "fetch-site-profile": {
      const data = await fetchSiteProfile(document);
      return {
        type: "fetch-site-profile",
        ok: !(data instanceof Error),
        data: stringifyWithError(data),
        origin: document.location.origin,
      };
    }
    case "fetch-website-profile-pair": {
      const data = await fetchWebsiteProfilePair(document);
      return {
        type: "fetch-website-profile-pair",
        ok: !(data instanceof Error),
        data: stringifyWithError(data),
        origin: document.location.origin,
      };
    }
    case "overlay-profiles":
      activate(overlay);
      profiles = message.profiles;
      websiteProfiles = message.websiteProfiles ?? [];
      activeDp = message.activeDp;
      overlay.contentWindow?.postMessage({
        type: "enter-overlay",
        profiles,
        activeDp,
      });
      return {
        type: "overlay-profiles",
      };
    case "close-window":
      overlay.contentWindow?.postMessage({ type: "leave-overlay" });
      return {
        type: "close-window",
      };
  }
}

chrome.runtime.onMessage.addListener(function (
  message: ContentScriptMessageRequest,
  _,
  sendResponse: (response: ContentScriptMessageResponse) => void,
): true /* NOTE: Chrome の場合、Promise には非対応 */ {
  void handleMessageResponse(message).then(
    (response) => response && sendResponse(response),
  );
  return true;
});

/* eslint complexity: ["off", { max: 13 }] -- TODO: 各メッセージハンドリング関数を外部化して */
function handlePostMessageResponse(event: ContentWindowPostMessageEvent) {
  switch (event.data.type) {
    case "enter-overlay":
      if (event.origin !== window.location.origin) return;
      event.source?.postMessage({
        type: "enter-overlay",
        profiles,
        websiteProfiles,
        activeDp,
      });
      break;
    case "leave-overlay":
      if (event.origin !== window.location.origin) return;
      deactivate(overlay);
      break;
    case "select-overlay-dp":
      if (event.origin !== window.location.origin) return;
      void chrome.runtime.sendMessage(event.data);
      break;
    case "update-ad-iframe": {
      if (event.origin !== event.data.sourceOrigin) return;
      const iframe = Array.from(document.getElementsByTagName("iframe")).find(
        (iframe) => iframe.contentWindow === event.source,
      );
      if (!iframe) return;
      iframe.dataset.documentProfileSubjects = Array.from(
        new Set(
          (iframe.dataset.documentsProfileSubjects ?? "")
            .split(" ")
            .filter(Boolean)
            .concat(event.data.ad.map(({ dp }) => dp.sub)),
        ),
      ).join(" ");
      break;
    }
  }
}

window.addEventListener("message", handlePostMessageResponse);

siteProfileMessenger.onMessage("fetchSiteProfile", async () => {
  const data = await fetchSiteProfile(document);
  return data;
});
