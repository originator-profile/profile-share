import { Link } from "react-router-dom";
import { useSession } from "../../utils/session";

export default function LoginFailed() {
  const session = useSession();

  const details = session.error ? (
    <section>
      <h2>詳細</h2>
      <p>{(session.error as Error).message}</p>
      <p>{(session.error as Error).stack}</p>
      <p>{String((session.error as Error).cause || "")}</p>
    </section>
  ) : null;

  return (
    <article className="mx-auto max-w-2xl px-4 py-8 min-h-[75vh] prose">
      <h1>ログインできませんでした</h1>
      <p>管理者にお問い合わせください。</p>
      {details}
      <Link to="/" className="text-blue-800">
        トップページに戻る
      </Link>
    </article>
  );
}
