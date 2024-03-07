import { Icon } from "@iconify/react";
import logomarkTransparentUrl from "@originator-profile/ui/src/assets/logomark-transparent.png";
import { Link } from "../../../router";

function Welcome() {
  return (
    <article className="flex items-center gap-4">
      <img
        width={452}
        height={388}
        className="flex-1 min-w-[24rem]"
        src={logomarkTransparentUrl}
        alt=""
      />
      <section className="shrink-0">
        <h2 className="text-2xl font-bold mb-4">
          あらかじめご用意いただくとスムーズです
        </h2>
        <ul className="list-disc pl-8 text-gray-600 text-sm mb-6">
          <li>組織の説明文</li>
          <li>Webサイトのプライバシーポリシーや編集ガイドラインURL</li>
          <li>企業ロゴマークの画像</li>
          <li>事務局からの連絡用メールアドレス</li>
          <li>取得済みの第三者認証情報</li>
        </ul>
        <Link
          className="inline-flex items-center gap-2 jumpu-outlined-button font-bold"
          to="/app/request-op/holder"
        >
          登録をはじめる
          <Icon icon="fa6-solid:arrow-right" />
        </Link>
      </section>
    </article>
  );
}

export default Welcome;
