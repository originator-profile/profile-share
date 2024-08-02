import { ProjectSummary } from "@originator-profile/ui";
import {
  ProfileGenericError,
  ProfilesVerifier,
  OriginatorProfileDecoder,
  OriginatorProfileVerifier,
  JwtVcIssuerKeys,
  VerifyResults,
  VerifyResult,
} from "@originator-profile/verify";
import { Fragment, useState, type ChangeEvent, type FormEvent } from "react";
import {
  DebugTargetSelectField,
  DebugTargetValue,
  DirectInputField,
  EndpointInputField,
  PresentationTypeInputField,
  PresentationTypeValue,
  RegistryInputField,
  ResultText,
  expand,
} from "../../components/debugger";

type InitialValues = {
  debugTarget: DebugTargetValue;
  registry: string;
  endpoint: string;
  source?: unknown;
};

type VerifyResultOriginatorProfile = Awaited<
  ReturnType<OriginatorProfileVerifier>
>;

function loadInitialValues(): InitialValues {
  try {
    return JSON.parse(window.atob(document.location.hash.slice(1)));
  } catch {
    return {
      debugTarget: "SD-JWT OP",
      registry: document.location.hostname,
      endpoint: `${document.location.origin}/website/ef9d78e0-d81a-4e39-b7a0-27e15405edc7/profiles`,
    };
  }
}

function saveInitialValues(
  input: InitialValues | ((oldVal: InitialValues) => InitialValues),
) {
  let val: InitialValues;
  if (typeof input === "function") {
    val = input(loadInitialValues());
  } else {
    val = input;
  }
  window.history.replaceState(null, "", `#${window.btoa(JSON.stringify(val))}`);
}

const initialValues: InitialValues = loadInitialValues();

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

function ResultFragment({ value }: { value: VerifyResult }) {
  if (value instanceof ProfileGenericError) {
    return (
      <>
        <p>
          type: {"op" in value.result ? "Originator Profile" : "Web Assertion"}
        </p>
        <p>{value.code}</p>
        <p>{value.message}</p>
        <ResultText>
          {JSON.stringify(value.result.payload, null, "  ")}
        </ResultText>
        <ResultText>{value.result.jwt}</ResultText>
        {"error" in value.result && (
          <ResultText>
            {JSON.stringify(value.result.error, null, "  ")}
          </ResultText>
        )}
      </>
    );
  } else if ("op" in value) {
    return <ResultText>{JSON.stringify(value, null, "  ")}</ResultText>;
  } else if ("dp" in value) {
    return <ResultText>{JSON.stringify(value, null, "  ")}</ResultText>;
  }
}

function Result({
  value,
}: {
  value: VerifyResults | VerifyResultOriginatorProfile;
}) {
  if (!Array.isArray(value))
    return <ResultText>{JSON.stringify(value, null, "  ")}</ResultText>;
  return (
    <>
      {value.map((value) => {
        return (
          <ResultFragment
            value={value}
            key={"result" in value ? value.result.jwt : value.jwt}
          />
        );
      })}
    </>
  );
}

export default function Debugger() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<
    VerifyResults | VerifyResultOriginatorProfile | null
  >(null);
  const [presentationType, setPresentationType] =
    useState<PresentationTypeValue>(
      "source" in initialValues ? "direct" : "url",
    );
  const handleChangePresentationType = (event: ChangeEvent<HTMLInputElement>) =>
    setPresentationType(event.target.value as PresentationTypeValue);

  async function prepareSource({
    directInput,
    registry,
    endpoint,
  }: {
    directInput: string;
    registry: string;
    endpoint: string;
  }): Promise<unknown> {
    switch (presentationType) {
      case "direct": {
        let source: unknown;
        try {
          source = JSON.parse(directInput);
        } catch {
          source = directInput;
        }
        setValues({ registry, source });
        saveInitialValues((val) => ({ ...val, source }));
        return source;
      }
      case "url": {
        setValues({ registry, endpoint });

        const response = await fetch(endpoint)
          .then((res) =>
            res.ok ? res.json() : new Error(`${res.status} ${res.statusText}`),
          )
          .catch((e: Error) => e);
        setValues({ registry, endpoint, response });
        return response;
      }
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const debugTarget =
      (formData.get("debugTarget") as DebugTargetValue) ?? "SD-JWT OP";
    const registry = String(formData.get("registry"));
    const endpoint = transformEndpoint(String(formData.get("endpoint")));
    const directInput = String(formData.get("directInput"));

    saveInitialValues({ debugTarget, registry, endpoint });

    /* 検証ソース */
    const source = await prepareSource({ directInput, registry, endpoint });
    if (source instanceof Error) return;

    const issuer =
      import.meta.env.DEV && registry === "localhost"
        ? "http://localhost:8080/"
        : `https://${registry}/`;
    const jwtVcIssuerMetadata = new URL(`${issuer}.well-known/jwt-vc-issuer`);
    const issuerKey = JwtVcIssuerKeys(jwtVcIssuerMetadata);

    setValues((values) => ({
      ...values,
      ["JWT VC Issuer Metadata Endpoint"]: jwtVcIssuerMetadata.href,
    }));

    switch (debugTarget) {
      case "SD-JWT OP": {
        const result = await OriginatorProfileVerifier(
          issuerKey,
          issuer,
          OriginatorProfileDecoder(null),
        )(String(source));
        setResult(result);
        break;
      }
      case "Profile Set": {
        const expanded = await expand(source);
        setValues((values) => ({ ...values, expanded }));
        if (expanded instanceof Error) return;
        const result = await ProfilesVerifier(
          expanded,
          issuerKey,
          registry,
          null,
          document.location.origin,
        )();
        setResult(result);
        break;
      }
    }
  }

  return (
    <article className="max-w-3xl px-4 pt-12 pb-8 space-y-8 mx-auto">
      <h1 className="text-4xl font-bold">Debugger</h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <DebugTargetSelectField
          name="debugTarget"
          defaultValue={initialValues.debugTarget}
        />
        <RegistryInputField
          id="registry"
          name="registry"
          defaultValue={initialValues.registry}
        />
        <PresentationTypeInputField
          value={presentationType}
          name="presentationType"
          onChange={handleChangePresentationType}
        />
        <EndpointInputField
          hidden={presentationType !== "url"}
          id="endpoint"
          name="endpoint"
          defaultValue={initialValues.endpoint}
        />
        <DirectInputField
          hidden={presentationType !== "direct"}
          id="directInput"
          name="directInput"
          defaultValue={initialValues.source}
        />

        <input className="jumpu-button" type="submit" value="Verify" />
      </form>
      {Object.entries(values).length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-2">Result</h2>
          <dl>
            {[...Object.entries(values)].map(
              ([key, value]: [string, unknown]) => (
                <Fragment key={key}>
                  <dt className="text-sm font-bold -mx-2 p-2 capitalize sticky top-0 bg-white">
                    {key}
                  </dt>
                  <dd className="ml-4 mb-4">
                    <ResultText>
                      {typeof value === "string" || value instanceof Error
                        ? String(value)
                        : JSON.stringify(value, null, "  ")}
                    </ResultText>
                  </dd>
                </Fragment>
              ),
            )}
            {result && (
              <>
                <dt className="text-sm font-bold -mx-2 p-2 sticky top-0 bg-white">
                  Verification Result
                </dt>
                <dd className="ml-4 mb-4 space-y-4">
                  <Result value={result} />
                </dd>
              </>
            )}
          </dl>
        </section>
      )}
      <ProjectSummary />
    </article>
  );
}
