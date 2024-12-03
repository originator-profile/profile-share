import { defineExtensionMessaging } from "@webext-core/messaging";
import { FetchCredentialsResult } from "@originator-profile/presentation";

export type FetchCredentialsMessageResult = {
  data: FetchCredentialsResult;
  origin: string;
  url: string;
};

type CredentialsProtocolMap = {
  fetchCredentials(message: null): FetchCredentialsMessageResult;
};

export const credentialsMessenger =
  defineExtensionMessaging<CredentialsProtocolMap>();
