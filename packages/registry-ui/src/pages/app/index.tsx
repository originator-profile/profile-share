import { useAuth0 } from "@auth0/auth0-react";
import { useAsync } from "react-use";
import useSWR from "swr";
import { Navigate } from "react-router-dom";
import fetcher from "../../utils/fetcher";

const useUser = (token: string | null = null) =>
  useSWR<{
    id: string;
    name: string;
    email: string;
    picture: string;
    accountId: string;
  }>(
    token && { method: "PUT", url: "/internal/user-accounts/", token },
    fetcher
  );

const useAccount = (
  token: string | null = null,
  accountId: string | null = null
) =>
  useSWR<{ roleValue: string }>(
    token && accountId && { url: `/internal/accounts/${accountId}/`, token },
    fetcher
  );

export default function Index() {
  const { getAccessTokenSilently } = useAuth0();

  const { value: token } = useAsync(async () => {
    return getAccessTokenSilently();
  });
  const { data: user } = useUser(token);
  const { data: account } = useAccount(token, user?.accountId);

  if (!account) {
    return (
      <>
        <div className="jumpu-spinner">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>
      </>
    );
  }

  if (account.roleValue === "group") return <Navigate to="./request-op" />;
  if (account.roleValue === "certifier") return <Navigate to="./review-op" />;

  // TODO: 画面遷移できなかった場合の見た目を実装して
  return <p>なにかがうまくいきませんでした</p>;
}
