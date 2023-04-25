import { type JSX, For, createSignal, onMount } from "solid-js";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfiles,
} from "@webdino/profile-verify";

type InitialValues = {
  registry: string;
  endpoint: string;
  profilesSet?: unknown;
};

function InitialValues() {
  const [initialValues, setInitialValues] = createSignal<InitialValues>({
    registry: document.location.hostname,
    endpoint: `${document.location.origin}/.well-known/ps.json`,
  });

  onMount(() => {
    try {
      const val = JSON.parse(window.atob(document.location.hash.slice(1)));

      setInitialValues(val);
    } catch {
      // nop
    }
  });

  return {
    initialValues,
    saveInitialValues(val: InitialValues) {
      window.history.replaceState(
        null,
        "",
        `#${window.btoa(JSON.stringify(val))}`
      );
    },
  };
}

export default function Pages() {
  const { initialValues, saveInitialValues } = InitialValues();
  const [values, setValues] = createSignal<Record<string, unknown>>({});

  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const registry = String(formData.get("registry"));
    const endpoint = String(formData.get("endpoint"));
    const jsonld = String(formData.get("jsonld"));

    let profilesSet;
    try {
      profilesSet = JSON.parse(jsonld);

      setValues({ registry, profilesSet });
      saveInitialValues({ registry, endpoint, profilesSet });
    } catch {
      setValues({ registry, endpoint });
      saveInitialValues({ registry, endpoint });

      const response = await fetch(endpoint)
        .then((res) =>
          res.ok ? res.json() : new Error(`${res.status} ${res.statusText}`)
        )
        .catch((e: Error) => e);
      setValues({ ...values(), response });
      if (response instanceof Error) return;

      profilesSet = response;
    }

    const expanded = await expandProfiles(profilesSet).catch((e) => e);
    setValues({ ...values(), expanded });
    if (expanded instanceof Error) return;

    const results = await ProfilesVerifier(
      expanded,
      RemoteKeys(new URL(`https://${registry}/.well-known/jwks.json`)),
      registry,
      null
    )();
    setValues({ ...values(), results });
  };

  return (
    <main>
      <h1>{document.title}</h1>
      <form onSubmit={onSubmit}>
        <label style={{ display: "flex", "flex-direction": "column" }}>
          Registry
          <input name="registry" required value={initialValues().registry} />
        </label>
        <label style={{ display: "flex", "flex-direction": "column" }}>
          Endpoint
          <input name="endpoint" type="url" value={initialValues().endpoint} />
        </label>
        or
        <label style={{ display: "flex", "flex-direction": "column" }}>
          Profiles Set
          <textarea name="jsonld" style={{ "font-family": "monospace" }}>
            {initialValues().profilesSet
              ? JSON.stringify(initialValues().profilesSet)
              : ""}
          </textarea>
        </label>
        <input type="submit" value="Verify" />
      </form>
      <dl>
        <For each={Object.entries(values())}>
          {([key, value]: [string, unknown]) => (
            <>
              <dt>{key}</dt>
              <dd>
                <pre>
                  {typeof value === "string" || value instanceof Error
                    ? String(value)
                    : JSON.stringify(value, null, "  ")}
                </pre>
              </dd>
            </>
          )}
        </For>
      </dl>
    </main>
  );
}
