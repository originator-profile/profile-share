import Template from "../templates/Prohibition";
import { useSiteProfile } from "../components/siteProfile";
import { useCredentials } from "../components/credentials";

function Prohibition() {
  const { tabId, error: sp_error } = useSiteProfile();
  const { error: credentials_error } = useCredentials();
  return (
    <Template
      errors={[sp_error, credentials_error].filter((x) => x !== undefined)}
      tabId={tabId}
    />
  );
}

export default Prohibition;
