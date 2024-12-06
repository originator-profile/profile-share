import {
  useCredentials,
  Credentials as Template,
} from "../components/credentials";

export default function Credentials() {
  const {
    origin: _origin,
    ops: _ops,
    cas,
    error: _error,
    tabId: _tabId,
  } = useCredentials();
  if (!cas) return null;

  return <Template cas={cas} />;
}
