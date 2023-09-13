import { Link } from "react-router-dom";

export default function LoginFailed() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-8 min-h-[75vh] prose">
      <h1>ログインできませんでした</h1>
      <p>管理者にお問い合わせください。</p>
      <Link to="/" className="text-blue-800">
        トップページに戻る
      </Link>
    </article>
  );
}
