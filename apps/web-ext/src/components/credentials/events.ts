import {
  defineExtensionMessaging,
  GetDataType,
  GetReturnType,
} from "@webext-core/messaging";
import { FetchCredentialsMessageResponse } from "./types";
import { VerifyIntegrity } from "@originator-profile/verify";

/** frameId 指定可能な defineExtensionMessaging() */
export function compatDefineExtensionMessaging<
  TProtocolMap extends Record<string, unknown>,
>() {
  const messenger = defineExtensionMessaging<TProtocolMap>();
  async function compatSendMessage<TType extends keyof TProtocolMap>(
    type: TType,
    data: GetDataType<TProtocolMap[TType]>,
    tabId: number,
    frameId: number,
  ): Promise<GetReturnType<TProtocolMap[TType]>> {
    const message = { type, data, timestamp: Date.now() };
    const options = { frameId };
    const { res } = await chrome.tabs.sendMessage(tabId, message, options);
    return res;
  }
  return {
    ...messenger,
    compatSendMessage,
  };
}

type CredentialsProtocolMap = {
  fetchCredentials(message: null): FetchCredentialsMessageResponse;
  verifyIntegrity(
    message: Parameters<VerifyIntegrity>,
  ): Awaited<ReturnType<VerifyIntegrity>>;
};

export const credentialsMessenger =
  compatDefineExtensionMessaging<CredentialsProtocolMap>();
