import { Navigate } from "react-router-dom";
import { useUserUpsert } from "../../utils/user";
import { useAccount } from "../../utils/account";

export default function Index() {
  const { data: user } = useUserUpsert();
  const { data: account } = useAccount(user?.accountId);

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
