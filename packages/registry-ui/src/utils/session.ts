import type { User } from "@originator-profile/model";
import {
  Auth0ContextInterface,
  GenericError,
  useAuth0,
} from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";
import fetcher from "./fetcher";

type UserWithOpAccountId = User & {
  accountId: string;
};

type AuthenticatedSession = {
  isAuthenticated: true;
  accessToken: string;
  user: UserWithOpAccountId;
};

type UnauthenticatedSession = {
  isAuthenticated: false;
  accessToken?: string;
  user?: UserWithOpAccountId;
};

/** ログイン情報 */
type Session = AuthenticatedSession | UnauthenticatedSession;

const url = "/internal/user-accounts/";

const unauthenticatedSession: UnauthenticatedSession = {
  isAuthenticated: false,
};

async function fetchSession(auth: Auth0ContextInterface): Promise<Session> {
  if (auth.error) throw auth.error;
  if (!auth.isAuthenticated) return unauthenticatedSession;

  let accessToken: string;

  try {
    accessToken = await auth.getAccessTokenSilently();
  } catch (e) {
    if (
      ["missing_refresh_token", "invalid_grant"].includes(
        (e as GenericError).error,
      )
    ) {
      // アクセストークンの権限が不足している場合はログインを試みる
      await auth.loginWithRedirect();
    }

    throw e;
  }

  if (!accessToken) return unauthenticatedSession;

  const user = await fetcher<UserWithOpAccountId>({
    method: "PUT",
    url,
    token: accessToken,
  });

  return {
    isAuthenticated: true,
    accessToken,
    user,
  };
}

/** ログイン情報へのアクセス */
export function useSession() {
  const auth = useAuth0();
  const session = useSWR(auth, fetchSession);
  const isLoading = auth.isLoading || session.isLoading;
  const error = auth.error || session.error;

  return {
    ...session,
    isLoading,
    error,
    getAccessToken: auth.getAccessTokenSilently,
    /** ログイン */
    async login() {
      await auth.loginWithRedirect();
    },
    /** ログアウト */
    async logout() {
      // すべてのキャッシュの破棄
      await mutate(() => true, undefined, { revalidate: false });

      await auth.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    },
  };
}
