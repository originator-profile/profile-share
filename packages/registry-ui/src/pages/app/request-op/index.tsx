import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../../utils/user";
import { useLatestRequest } from "../../../utils/request";
import RequestStatus from "../../../components/RequestStatus";

function Index() {
  const { user: token } = useAuth0();
  const { data: user } = useUser(token?.sub ?? null);
  const { data: request } = useLatestRequest(user?.accountId ?? null);
  return <article>{request && <RequestStatus request={request} />}</article>;
}

export default Index;
