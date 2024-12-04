import { Navigate } from "react-router";
import { Spinner } from "@originator-profile/ui";
import { useSession } from "../../utils/session";
import { useAccount } from "../../utils/account";
import { useVersionInfo } from "../../utils/versions";

function isLoading(
  sessionLoading: boolean,
  accountLoading: boolean,
  versionLoading: boolean,
): boolean {
  return sessionLoading || accountLoading || versionLoading;
}

function hasError(
  sessionError: unknown,
  accountError: unknown,
  versionError: unknown,
): boolean {
  return !!(sessionError || accountError || versionError);
}

function getRedirectPath(roleValue: string | undefined): string {
  switch (roleValue) {
    case "group":
      return "./request-op";
    case "certifier":
      return "./review-op";
    default:
      return "./login-failed";
  }
}

export default function Index() {
  const session = useSession();
  const accountIdOrNull = session.data?.user?.accountId ?? null;
  const account = useAccount(accountIdOrNull);
  const version = useVersionInfo();

  if (isLoading(session.isLoading, account.isLoading, version.isLoading)) {
    return (
      <article className="min-h-[75vh] flex flex-col gap-8 justify-center items-center">
        <Spinner />
        <p>ログインしています…</p>
      </article>
    );
  }

  if (hasError(session.error, account.error, version.error)) {
    console.error(
      new Error("ログインに失敗しました。", {
        cause: session.error || account.error || version.error,
      }),
    );
    return <Navigate to="./login-failed" />;
  }

  return <Navigate to={getRedirectPath(account.data?.roleValue)} />;
}
