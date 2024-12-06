import { CasProps } from "./types";

export function Credentials(props: CasProps) {
  return (
    <div>
      <h2>Content Attestation Set</h2>
      <pre data-testid="cas" className="overflow-auto">
        {JSON.stringify(props.cas, null, 2)}
      </pre>
      <br />
    </div>
  );
}
