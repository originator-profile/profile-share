import { defineExtensionMessaging } from "@webext-core/messaging";

type SiteProfileProtocolMap = {
  fetchSiteProfile(message: null): string;
};

export const siteProfileMessenger =
  defineExtensionMessaging<SiteProfileProtocolMap>();
