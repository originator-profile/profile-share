import {
  Credentials as Template,
  useCredentials,
} from "../components/credentials";
import { useSiteProfile } from "../components/siteProfile";

export default function Credentials() {
  const { siteProfile } = useSiteProfile();
  const {
    origin: _origin,
    ops: _ops,
    cas,
    error: _error,
    tabId: _tabId,
  } = useCredentials(siteProfile);
  if (!cas) return null;

  return <Template cas={cas} />;
}
