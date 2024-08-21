import {
  useWebsiteMetadata,
  WebsiteMetadata as Template,
} from "../components/websiteMetadata";

export default function WebsiteMetadata() {
  const websiteMetadata = useWebsiteMetadata();

  if (!websiteMetadata.data) return null;

  return <Template websiteMetadata={websiteMetadata.data} />;
}
