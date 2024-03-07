import { Navigate } from "react-router-dom";
import { Spinner } from "@originator-profile/ui";
import { useSession } from "../../utils/session";
import { useAccount } from "../../utils/account";

export default function Index() {
  const session = useSession();
  const accountIdOrNull = session.data?.user?.accountId ?? null;
  const account = useAccount(accountIdOrNull);

  if (session.isLoading || account.isLoading) {
    return (
      <article className="min-h-[75vh] flex flex-col gap-8 justify-center items-center">
        <Spinner />
        <p>ログインしています…</p>
      </article>
    );
  }

  const error = session.error || account.error;

  if (error) {
    console.error(new Error("ログインに失敗しました。", { cause: error }));

    return <Navigate to="./login-failed" />;
  }

  switch (account.data?.roleValue) {
    case "group":
      return <Navigate to="./request-op" />;
    case "certifier":
      return <Navigate to="./review-op" />;
    default:
      return <Navigate to="./login-failed" />;
  }
}
