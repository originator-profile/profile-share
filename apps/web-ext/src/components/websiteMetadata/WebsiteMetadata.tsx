import { WebsiteMetadataProps } from "./types";

export function WebsiteMetadata(props: WebsiteMetadataProps) {
  return (
    <pre data-testid="website-metadata" className="overflow-auto">
      {JSON.stringify(props.websiteMetadata, null, 2)}
    </pre>
  );
}
