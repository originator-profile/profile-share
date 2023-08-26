import { useAuth0 } from "@auth0/auth0-react";

export default function Index() {
  const { loginWithRedirect, isLoading, isAuthenticated, user } = useAuth0();
  const handleClickLogin = () => loginWithRedirect();

  if (isLoading) {
    return (
      <div className="jumpu-spinner">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" />
        </svg>
      </div>
    );
  }

  // TODO: ログアウト機能を実装して
  // TODO: レジストリ DB にユーザーアカウント情報を永続化して
  if (isAuthenticated && user) {
    return (
      <div className="jumpu-card">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    );
  }

  // TODO: グローバルナビゲーションにログインボタンを配置して
  return (
    <button className="jumpu-button" type="button" onClick={handleClickLogin}>
      ログイン
    </button>
  );
}
