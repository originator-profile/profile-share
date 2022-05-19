import browser from "webextension-polyfill";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { expand } from "jsonld";
import useSWR, { mutate } from "swr";
import { useAsync } from "react-use";
import { Op } from "@webdino/profile-model";
import { OpMessageResponse } from "../types/message";
import { toOp } from "../utils/op";

const key = "ops";

async function fetchOps(_: typeof key, targetOrigin?: string) {
  if (!targetOrigin) {
    throw new Error("プロファイルを取得するウェブページが特定できませんでした");
  }
  const context = "https://github.com/webdino/profile#";
  const issuer = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(`${issuer}/.well-known/jwks.json`);
  const opEndpoint = new URL(`${targetOrigin}/.well-known/op-document`);
  const data = await fetch(opEndpoint.href)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ステータスコード ${res.status}`);
      }
      return res.json();
    })
    .catch((e) => e);
  if (data instanceof Error) {
    throw {
      ...data,
      message: `プロファイルを取得できませんでした:\n${data.message}`,
    };
  }
  const [op] = await expand(data);
  if (!op) return [];
  // @ts-expect-error assert
  const profile: string[] = op[`${context}profile`].map(
    (o: { "@value": string }) => o["@value"]
  );
  const jwks = createRemoteJWKSet(jwksEndpoint);
  const verifies = await Promise.all(
    profile.map((jwt: string) =>
      jwtVerify(jwt, jwks, { issuer })
        .then((dec) => dec.payload)
        .catch((e) => e)
    )
  );
  const verifyError = verifies.find((verify) => verify instanceof Error);
  if (verifyError) {
    throw {
      ...verifyError,
      message: `プロファイルを検証できませんでした:\n${verifyError.message}`,
    };
  }
  return verifies.map(toOp);
}

function useOps() {
  const message = useAsync(async () => {
    // TODO: 拡張機能を呼び出したアクティブタブであることを保証する
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: false,
    });
    const response: OpMessageResponse = await browser.tabs.sendMessage(
      tabs[0].id ?? NaN,
      { type: "op" }
    );
    return response;
  });
  const { data: ops, error } = useSWR<Op[]>(
    [key, message.value?.targetOrigin],
    fetchOps
  );
  return {
    ops,
    error: message.error || error,
    targetOrigin: message.value?.targetOrigin,
  };
}

export default useOps;

export function revalidateOps(targetOrigin?: string) {
  return mutate([key, targetOrigin]);
}
