import { defineExtensionMessaging } from "@webext-core/messaging";
import { FetchCredentialsMessageResponse } from "./types";

type CredentialsProtocolMap = {
  fetchCredentials(message: null): FetchCredentialsMessageResponse;
};

export const credentialsMessenger =
  defineExtensionMessaging<CredentialsProtocolMap>();
