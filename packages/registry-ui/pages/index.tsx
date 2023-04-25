import { type FormEvent, Fragment, useState } from "react";
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

function saveInitialValues(val: InitialValues) {
  window.history.replaceState(null, "", `#${window.btoa(JSON.stringify(val))}`);
}

function loadInitialValues() {
  try {
    return JSON.parse(window.atob(document.location.hash.slice(1)));
  } catch {
    return {
      registry: document.location.hostname,
      endpoint: `${document.location.origin}/.well-known/ps.json`,
    };
  }
}

const initialValues = loadInitialValues();

export default function Pages() {
  const [values, setValues] = useState<Record<string, unknown>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
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
      setValues((values) => ({ ...values, response }));
      if (response instanceof Error) return;

      profilesSet = response;
    }

    const expanded = await expandProfiles(profilesSet).catch((e) => e);
    setValues((values) => ({ ...values, expanded }));
    if (expanded instanceof Error) return;

    const results = await ProfilesVerifier(
      expanded,
      RemoteKeys(new URL(`https://${registry}/.well-known/jwks.json`)),
      registry,
      null
    )();
    setValues((values) => ({ ...values, results }));
  }

  return (
    <>
      <h1>{document.title}</h1>
      <form onSubmit={onSubmit}>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Registry
          <input
            name="registry"
            required
            defaultValue={initialValues.registry}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Endpoint
          <input
            name="endpoint"
            type="url"
            defaultValue={initialValues.endpoint}
          />
        </label>
        or
        <label style={{ display: "flex", flexDirection: "column" }}>
          Profiles Set
          <textarea
            name="jsonld"
            style={{ fontFamily: "monospace" }}
            defaultValue={
              initialValues.profilesSet
                ? JSON.stringify(initialValues.profilesSet)
                : ""
            }
          />
        </label>
        <input type="submit" value="Verify" />
      </form>
      <dl>
        {[...Object.entries(values)].map(([key, value]: [string, unknown]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>
              <pre>
                {typeof value === "string" || value instanceof Error
                  ? String(value)
                  : JSON.stringify(value, null, "  ")}
              </pre>
            </dd>
          </Fragment>
        ))}
      </dl>
    </>
  );
}
