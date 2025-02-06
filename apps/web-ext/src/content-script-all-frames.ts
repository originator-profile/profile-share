import { stringifyWithError } from "@originator-profile/core";
import {
  fetchCredentials,
  FetchCredentialSetResult,
} from "@originator-profile/presentation";
import { verifyIntegrity } from "@originator-profile/verify";
import {
  credentialsMessenger,
  FetchCredentialsMessageResult,
  FrameLocation,
} from "./components/credentials";
import "./utils/cors-basic-auth";

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
