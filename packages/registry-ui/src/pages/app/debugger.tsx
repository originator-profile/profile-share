import { ProjectSummary } from "@originator-profile/ui";
import {
  ProfileGenericError,
  ProfilesVerifier,
  RemoteKeys,
  expandProfilePairs,
  expandProfileSet,
  VerifyResults,
  VerifyResult,
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
      registry: new URL(document.location.origin).href,
      endpoint: `${document.location.origin}/ps.json`,
    };
  }
}

const initialValues = loadInitialValues();

function EndpointInputField({ hidden }: { hidden: boolean }) {
  const helpText =
    "Profile Set を取得するエンドポイントです。URL ではない場合、ドメイン名とみなして https スキームと連結します。URL パスを含まない場合、サイトプロファイル Well-known URL パスと連結します。";
  return (
    <FormRow
      className={clsx({ hidden })}
      label="Endpoint"
      htmlFor="endpoint"
      helpText={helpText}
    >
      <input
        id="endpoint"
        className="jumpu-input flex-1"
        name="endpoint"
        defaultValue={initialValues.endpoint}
        hidden={hidden}
      />
    </FormRow>
  );
}

function DirectInputField({ hidden }: { hidden: boolean }) {
  return (
    <FormRow className={clsx({ hidden })} label="Profile Set" htmlFor="jsonld">
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
        hidden={hidden}
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

function Result({ value }: { value: VerifyResult }) {
  if (value instanceof ProfileGenericError) {
    return (
      <>
        <p>
          type: {"op" in value.result ? "Originator Profile" : "Web Assertion"}
        </p>
        <p>{value.code}</p>
        <p>{value.message}</p>
        <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
          {JSON.stringify(value.result.payload, null, "  ")}
        </pre>
        <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
          {value.result.jwt}
        </pre>
        {"error" in value.result && (
          <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
            {JSON.stringify(value.result.error, null, "  ")}
          </pre>
        )}
      </>
    );
  } else if ("op" in value) {
    return (
      <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
        {JSON.stringify(value, null, "  ")}
      </pre>
    );
  } else if ("dp" in value) {
    return (
      <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
        {JSON.stringify(value, null, "  ")}
      </pre>
    );
  }
}

function ErrorResult({ value }: { value: VerifyResults }) {
  return (
    <>
      {(value as VerifyResults).map((value) => (
        <Result
          value={value}
          key={"result" in value ? value.result.jwt : value.jwt}
        />
      ))}
    </>
  );
}

export default function Debugger() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [results, setResults] = useState<VerifyResults>([]);
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
        setValues({ registry, profileSet });
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
      import.meta.env.DEV && registry === "http://localhost:8080/"
        ? `http://localhost:8080/.well-known/jwks.json`
        : `${registry}.well-known/jwks.json`,
    );
    const results = await ProfilesVerifier(
      expanded,
      RemoteKeys(jwksEndpoint),
      registry,
      null,
      document.location.origin,
    )();
    setResults(results);
  }
  return (
    <article className="max-w-3xl px-4 pt-12 pb-8 space-y-8 mx-auto">
      <h1 className="text-4xl font-bold">Profile Set Debugger</h1>
      <link href="/ps.json" rel="alternate" type="application/ld+json" />
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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

        <EndpointInputField hidden={presentation !== "url"} />

        <DirectInputField hidden={presentation !== "direct"} />

        <input className="jumpu-button" type="submit" value="Verify" />
      </form>
      {Object.entries(values).length > 0 && (
        <section className="[&>:first-child]:mb-4">
          <h2 className="text-2xl font-bold">Result</h2>
          <dl>
            {[...Object.entries(values)].map(
              ([key, value]: [string, unknown]) => (
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
              ),
            )}
            {results.length > 0 && (
              <Fragment>
                <dt className="text-sm font-bold mb-2">Results</dt>
                <dd className="ml-4 mb-6">
                  <ErrorResult value={results} />
                </dd>
              </Fragment>
            )}
          </dl>
        </section>
      )}
      <ProjectSummary />
    </article>
  );
}
