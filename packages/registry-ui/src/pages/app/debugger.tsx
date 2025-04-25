import { useState } from "react";
import {
  DebuggerForm,
  Values,
  DebugDetailItem,
  Outputs,
} from "../../components/debugger";

function loadInitialValues(): Values {
  try {
    return JSON.parse(window.atob(document.location.hash.slice(1)));
  } catch {
    return {
      trustedOpId: `dns:${document.location.hostname}`,
      trustedOps: import.meta.env.VITE_REGISTRY_OPS,
      casType: "embedded",
      opsType: "embedded",
      spType: "external",
      verifySp: "on",
      sp:
        import.meta.env.DEV === true
          ? "http://localhost:8080/"
          : "https://originator-profile.org/",
      url:
        import.meta.env.DEV === true
          ? "http://localhost:8080/"
          : "https://originator-profile.org/",
    };
  }
}

function saveInitialValues(input: Values | ((oldVal: Values) => Values)) {
  let val: Values;
  if (typeof input === "function") {
    val = input(loadInitialValues());
  } else {
    val = input;
  }
  window.history.replaceState(null, "", `#${window.btoa(JSON.stringify(val))}`);
}

const initialValues: Values = loadInitialValues();

export default function Debugger() {
  const [outputs, setOutputs] = useState<Outputs>([]);
  return (
    <article className="max-w-3xl px-4 pt-12 pb-8 space-y-8 mx-auto">
      <h1 className="text-4xl font-bold">Debugger</h1>
      <DebuggerForm
        initialValues={initialValues}
        saveInitialValues={saveInitialValues}
        onOutput={(output) => setOutputs((outputs) => [...outputs, output])}
        onOutputReset={() => setOutputs([])}
      />
      {outputs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-2">Result</h2>
          <dl>
            {outputs.map((output, index) => (
              <DebugDetailItem key={index} {...output} className="mb-4" />
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
