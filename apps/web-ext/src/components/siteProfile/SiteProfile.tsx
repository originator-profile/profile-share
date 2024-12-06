import { SiteProfileProps } from "./types";

export function SiteProfile(props: SiteProfileProps) {
  return (
    <div>
      <h2>Site Profile</h2>
      <pre data-testid="site-profile" className="overflow-auto">
        {JSON.stringify(props.siteProfile, null, 2)}
      </pre>
      <br />
    </div>
  );
}
