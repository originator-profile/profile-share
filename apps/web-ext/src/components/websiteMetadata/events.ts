import { defineExtensionMessaging } from "@webext-core/messaging";
import { FetchWebsiteMetadataResult } from "@originator-profile/verify";

type WebsiteMetadataProtocolMap = {
  fetchWebsiteMetadata(message: null): FetchWebsiteMetadataResult;
};

export const websiteMetadataMessenger =
  defineExtensionMessaging<WebsiteMetadataProtocolMap>();
