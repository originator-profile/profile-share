import { createRemoteJWKSet, jwtVerify } from "jose";
import { expand } from "jsonld";
import browser from "webextension-polyfill";

async function verifyOp() {
  const context = "https://github.com/webdino/profile#";
  const issuer = document.location.origin;
  const jwksEndpoint = new URL(`${issuer}/.well-known/jwks.json`);
  const targetOrigin = document.location.hash.slice(1) || issuer;
  const opEndpoint = new URL(`${targetOrigin}/.well-known/op-document`);
  const data = await fetch(opEndpoint.href)
    .then((res) => res.json())
    .catch((e) => e);
  const [op] = await expand(data);
  if (op) return;
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
  return verifies;
}

function handleMessage(
  _request: unknown,
  _sender: browser.Runtime.MessageSender
) {
  return verifyOp().then((result) => result);
}

browser.runtime.onMessage.addListener(handleMessage);
console.log(browser.runtime.onMessage.hasListener(handleMessage));
