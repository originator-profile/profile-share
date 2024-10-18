import { SiteProfileProps } from "./types";

export function SiteProfile(props: SiteProfileProps) {
  return (
    <pre data-testid="site-profile" className="overflow-auto">
      {JSON.stringify(props.siteProfile, null, 2)}
    </pre>
  );
}
