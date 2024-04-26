import { ProjectSummary } from "@originator-profile/ui";
import {
  ProfilesVerifier,
  RemoteKeys,
  expandProfilePairs,
  expandProfileSet,
} from "@originator-profile/verify";
import clsx from "clsx";
import { Fragment, useState, type ChangeEvent, type FormEvent } from "react";
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

function EndpointInputField() {
  return (
    <FormRow label="Endpoint" htmlFor="endpoint">
      <input
        id="endpoint"
        className="jumpu-input flex-1"
        name="endpoint"
        defaultValue={initialValues.endpoint}
      />
    </FormRow>
  );
}

/** URL としてパースできないケースや URL path が "" や "/" のケースでの変換処理 */
function transformEndpoint(endpoint: string): string {
  // NOTE: URL パースできないケース … 特別に "https://" + endpoint と解釈 (#1240)
  if (!URL.canParse(endpoint)) {
    endpoint = `https://${endpoint}`;
  }

  // NOTE: URL path が "" や "/" のケース … 特別に "/.well-known/pp.json" と解釈 (#1240)
  if (new URL(endpoint).origin === endpoint.replace(/[/]$/, "")) {
    endpoint = new URL("/.well-known/pp.json", endpoint).href;
  }

  return endpoint;
}

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
    const endpoint = transformEndpoint(String(formData.get("endpoint")));
    const jsonld = String(formData.get("jsonld"));

    let profileSet;

    switch (presentation) {
      case "direct": {
        try {
          profileSet = JSON.parse(jsonld);
        } catch {
          profileSet = jsonld;
        }
        setValues({ registry, endpoint });
        saveInitialValues({ registry, endpoint, profileSet });
        break;
      }
      case "url": {
        setValues({ registry, endpoint });
        saveInitialValues({ registry, endpoint });

        const response = await fetch(endpoint)
          .then((res) =>
            res.ok ? res.json() : new Error(`${res.status} ${res.statusText}`),
          )
          .catch((e: Error) => e);
        setValues((values) => ({ ...values, response }));
        if (response instanceof Error) return;

        profileSet = response;
        break;
      }
    }

    const pp = await expandProfilePairs(profileSet).catch((e) => e);
    const isAdPp = pp.ad?.length > 0;
    const isSitePp = pp.website?.length > 0;
    const expanded = await expandProfileSet(
      isAdPp
        ? {
            ...profileSet,
            profile: [pp.ad[0].op.profile, pp.ad[0].dp.profile],
          }
        : isSitePp
          ? {
              ...profileSet,
              profile: [pp.website[0].op.profile, pp.website[0].dp.profile],
            }
          : profileSet,
    ).catch((e) => e);

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
      <form className="mb-8 flex flex-col gap-4" onSubmit={onSubmit}>
        <FormRow label="Registry" htmlFor="registry">
          <input
            id="registry"
            className="jumpu-input flex-1"
            name="registry"
            required
            defaultValue={initialValues.registry}
          />
        </FormRow>

        <FormRow label="Profile Set Presentation">
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

        {presentation === "url" && <EndpointInputField />}

        <FormRow
          className={clsx({ hidden: presentation !== "direct" })}
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
        <h2 className="text-2xl font-bold">Result</h2>
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
