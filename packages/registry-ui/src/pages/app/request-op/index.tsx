import { Spinner } from "@originator-profile/ui";
import RequestStatus from "../../../components/RequestStatus";
import { useSession } from "../../../utils/session";
import { useLatestRequest } from "../../../utils/request";
import { useAccount } from "../../../utils/account";
import { Navigate } from "../../../router";

function Index() {
  const latestRequest = useLatestRequest();
  const opAccountIdOrNull = useSession().data?.user?.accountId ?? null;
  const opAccount = useAccount(opAccountIdOrNull);
  const isLoading =
    latestRequest.isLoading || !opAccountIdOrNull || opAccount.isLoading;

  if (isLoading) return <Spinner />;

  // 必須項目「組織名」が無効値の場合「登録をはじめる」画面に遷移
  const welcomeToTheOpRegistry = !opAccount?.data?.name;

  if (welcomeToTheOpRegistry) return <Navigate to="/app/request-op/welcome" />;

  return (
    <article>
      <RequestStatus request={latestRequest.data} />
    </article>
  );
}

export default Index;
