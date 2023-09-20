import { Navigate } from "react-router-dom";
import { useUserUpsert } from "../../utils/user";
import { useAccount } from "../../utils/account";

export default function Index() {
  const { data: user } = useUserUpsert();
  const { data: account } = useAccount(user?.accountId ?? null);

  if (!account) {
    return (
      <article className="min-h-[75vh] flex flex-col gap-8 justify-center items-center">
        <div className="jumpu-spinner">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>
        <p>ログインしています…</p>
      </article>
    );
  }

  if (account.roleValue === "group") return <Navigate to="./request-op" />;
  if (account.roleValue === "certifier") return <Navigate to="./review-op" />;
  <Navigate to="./login-failed" />;
}
