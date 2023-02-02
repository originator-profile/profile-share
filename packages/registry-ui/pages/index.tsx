import { For, createSignal } from "solid-js";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfiles,
} from "@webdino/profile-verify";

function useProfile() {
  const context = "https://github.com/webdino/profile#";
  const issuer = document.location.hostname;
  const jwksEndpoint = new URL(
    `${document.location.origin}/.well-known/jwks.json`
  );
  const profileEndpoint = new URL(
    `${document.location.origin}/.well-known/ps.json`
  );
  const [values, setValues] = createSignal<[string, unknown][]>([
    ["context", context],
    ["issuer", issuer],
    ["jwksEndpoint", jwksEndpoint],
    ["profileEndpoint", profileEndpoint],
  ]);
  const verify = async () => {
    const data = await fetch(profileEndpoint.href)
      .then((res) => res.json())
      .catch((e) => e);
    if (data instanceof Error) {
      setValues([...values(), ["profile", `invalid: ${data.message}`]]);
      return;
    }
    const { main, profile } = await expandProfiles(data);
    if (main.length > 0) {
      setValues([
        ...values(),
        ["main", main.includes(issuer) ? JSON.stringify(main) : "invalid"],
      ]);
    }
    const keys = RemoteKeys(jwksEndpoint);
    const verify = ProfilesVerifier({ profile }, keys, issuer, null);
    const verifyResults = await verify();
    setValues([...values(), ["verifies", JSON.stringify(verifyResults)]]);
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
