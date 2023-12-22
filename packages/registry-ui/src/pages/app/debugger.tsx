import { type ChangeEvent, type FormEvent, Fragment, useState } from "react";
import clsx from "clsx";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfileSet,
} from "@originator-profile/verify";
import { ProjectSummary } from "@originator-profile/ui";
import FormRow from "../../components/FormRow";

type InitialValues = {
  registry: string;
  endpoint: string;
  profileSet?: unknown;
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
      endpoint: `${document.location.origin}/ps.json`,
    };
  }
}

const initialValues = loadInitialValues();

export default function Debugger() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [presentation, setPresentation] = useState(
    "profileSet" in initialValues ? "direct" : "url",
  );
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPresentation(event.target.value);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const registry = String(formData.get("registry"));
    const endpoint = String(formData.get("endpoint"));
    const jsonld = String(formData.get("jsonld"));

    let profileSet;

    switch (presentation) {
      case "direct":
        try {
          profileSet = JSON.parse(jsonld);
        } catch {
          profileSet = jsonld;
        }
        setValues({ registry, profileSet });
        saveInitialValues({ registry, endpoint, profileSet });
        break;
      case "url":
        {
          setValues({ registry, endpoint });
          saveInitialValues({ registry, endpoint });

          const response = await fetch(endpoint)
            .then((res) =>
              res.ok
                ? res.json()
                : new Error(`${res.status} ${res.statusText}`),
            )
            .catch((e: Error) => e);
          setValues((values) => ({ ...values, response }));
          if (response instanceof Error) return;

          profileSet = response;
        }
        break;
    }

    const expanded = await expandProfileSet(profileSet).catch((e) => e);
    setValues((values) => ({ ...values, expanded }));
    if (expanded instanceof Error) return;

    const jwksEndpoint = new URL(
      import.meta.env.DEV && registry === "localhost"
        ? `http://localhost:8080/.well-known/jwks.json`
        : `https://${registry}/.well-known/jwks.json`,
    );
    const results = await ProfilesVerifier(
      expanded,
      RemoteKeys(jwksEndpoint),
      registry,
      null,
      document.location.origin,
    )();
    setValues((values) => ({ ...values, results }));
  }
  return (
    <article className="max-w-3xl px-4 pt-12 pb-8 mx-auto">
      <h1 className="text-4xl font-bold mb-8">Profile Set Debugger</h1>
      <link href="/ps.json" rel="alternate" type="application/ld+json" />
      <form className="mb-8" onSubmit={onSubmit}>
        <FormRow className="mb-4" label="Registry" htmlFor="registry">
          <input
            id="registry"
            className="jumpu-input flex-1"
            name="registry"
            required
            defaultValue={initialValues.registry}
          />
        </FormRow>

        <FormRow className="mb-4" label="Profile Set Presentation">
          <div className="flex gap-1 items-center">
            <label className="flex items-center py-1">
              <input
                id="presentation-url"
                name="presentation"
                type="radio"
                value="url"
                checked={presentation === "url"}
                onChange={handleChange}
              />
              URL
            </label>
            <label className="flex items-center py-1">
              <input
                id="presentation-direct"
                name="presentation"
                type="radio"
                value="direct"
                checked={presentation === "direct"}
                onChange={handleChange}
              />
              Direct Input
            </label>
          </div>
        </FormRow>

        <FormRow
          className={clsx("mb-4", { hidden: presentation !== "url" })}
          label="Endpoint"
          htmlFor="endpoint"
        >
          <input
            id="endpoint"
            className="jumpu-input flex-1"
            name="endpoint"
            type="url"
            defaultValue={initialValues.endpoint}
            hidden={presentation !== "url"}
          />
        </FormRow>

        <FormRow
          className={clsx("mb-4", { hidden: presentation !== "direct" })}
          label="Profile Set"
          htmlFor="jsonld"
        >
          <textarea
            id="jsonld"
            className="jumpu-textarea resize flex-1"
            name="jsonld"
            cols={12}
            rows={18}
            style={{ fontFamily: "monospace" }}
            defaultValue={
              initialValues.profileSet
                ? JSON.stringify(initialValues.profileSet)
                : ""
            }
            hidden={presentation !== "direct"}
          />
        </FormRow>

        <input className="jumpu-button" type="submit" value="Verify" />
      </form>
      {Object.entries(values).length > 0 && (
        <h2 className="text-2xl font-bold mb-4">Result</h2>
      )}
      <dl>
        {[...Object.entries(values)].map(([key, value]: [string, unknown]) => (
          <Fragment key={key}>
            <dt className="text-sm font-bold mb-2">{key}</dt>
            <dd className="ml-4 mb-6">
              <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
                {typeof value === "string" || value instanceof Error
                  ? String(value)
                  : JSON.stringify(value, null, "  ")}
              </pre>
            </dd>
          </Fragment>
        ))}
      </dl>
      <ProjectSummary />
    </article>
  );
}
