import { useAuth0 } from "@auth0/auth0-react";
import { useAsync } from "react-use";

export default function Index() {
  const {
    loginWithRedirect,
    logout,
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useAsync(async () => {
    const token = await getAccessTokenSilently();
    await fetch("/internal/user-accounts/", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  if (isLoading) {
    return (
      <div className="jumpu-spinner">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" />
        </svg>
      </div>
    );
  }

  // TODO: グローバルナビゲーションにログアウトボタンを配置して
  // TODO: レジストリ DB にユーザーアカウント情報を永続化して
  if (isAuthenticated && user) {
    return (
      <>
        <button className="jumpu-button" type="button" onClick={() => logout()}>
          ログアウト
        </button>
        <div className="jumpu-card">
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </>
    );
  }

  // TODO: グローバルナビゲーションにログインボタンを配置して
  return (
    <button
      className="jumpu-button"
      type="button"
      onClick={() => loginWithRedirect()}
    >
      ログイン
    </button>
  );
}
