import { For, createSignal } from "solid-js";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { expand } from "jsonld";

function useProfile() {
  const context = "https://github.com/webdino/profile#";
  const issuer = document.location.origin;
  const jwksEndpoint = new URL(`${issuer}/.well-known/jwks.json`);
  const targetOrigin = document.location.hash.slice(1) || issuer;
  const opEndpoint = new URL(`${targetOrigin}/.well-known/op-document`);
  const [values, setValues] = createSignal<[string, unknown][]>([
    ["context", context],
    ["issuer", issuer],
    ["jwksEndpoint", jwksEndpoint],
    ["targetOrigin", targetOrigin],
    ["opEndpoint", opEndpoint],
  ]);
  const verify = async () => {
    const data = await fetch(opEndpoint.href)
      .then((res) => res.json())
      .catch((e) => e);
    if (data instanceof Error) {
      setValues([...values(), ["op", `invalid: ${data.message}`]]);
      return;
    }
    const [op] = await expand(data);
    setValues([...values(), ["op", JSON.stringify(op)]]);
    // @ts-expect-error assert
    const main: string[] = op[`${context}main`].map(
      (o: { "@value": string }) => o["@value"]
    );
    // @ts-expect-error assert
    const profile: string[] = op[`${context}profile`].map(
      (o: { "@value": string }) => o["@value"]
    );
    if (main.length > 0) {
      setValues([
        ...values(),
        [
          "main",
          main.includes(targetOrigin) ? JSON.stringify(main) : "invalid",
        ],
      ]);
    }
    const jwks = createRemoteJWKSet(jwksEndpoint);
    const verifies = await Promise.all(
      profile.map((jwt: string) =>
        jwtVerify(jwt, jwks, { issuer, subject: targetOrigin })
          .then((dec) => dec.payload)
          .catch((e) => e)
      )
    );
    setValues([...values(), ["verifies", JSON.stringify(verifies)]]);
  };

  return { values, verify };
}

export default function Pages() {
  const { values, verify } = useProfile();

  return (
    <main>
      <h1>{document.title}</h1>
      <dl>
        <For each={values()}>
          {([key, value]: [string, unknown]) => (
            <>
              <dt>{key}</dt>
              <dd>{String(value)}</dd>
            </>
          )}
        </For>
      </dl>
      <button onClick={verify}>Verify</button>
    </main>
  );
}
