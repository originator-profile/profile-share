import { ProjectTitle, ProjectSummary } from "@originator-profile/ui";
import { Icon } from "@iconify/react";
import { Dp } from "@originator-profile/ui/src/types";
import { Link} from "react-router-dom";
import { routes } from "../utils/routes";

type ProhibitionProps = {
  dp: Dp;
  tabId: number;
};

function WarningDetails({ dp, tabId }: ProhibitionProps) {
  return (
    <div className="pt-3">
      <p>
        Originator Profile
        ではこのサイトが本物であるかの確認を「認証鍵」という電子証明によって行っています。
        <br />
        このメッセージが表示されている場合、以下の2つの原因が考えられます
      </p>
      <ol className="pt-3 px-0.5 list-decimal">
        <li>
          (悪意のない正当な組織担当者が)認証鍵の取り扱いについて何らかの誤りがある
        </li>
        <li>
          (悪意のある第三者が)認証鍵を改ざんし、偽サイトを本物のように見せようとしている
        </li>
      </ol>
      <p className="pt-3">
        特に 2. の場合はあなたを欺き不利益を与える危険なサイトと考えられます。
        <br />
        これらの理由によりこのサイトが偽サイトである可能性をあなたにお伝えしています。
        <br />
        証明書は改ざん・偽装されている可能性があるのでご注意ください。
        <br />
      </p>
      <Link
          className="block text-gray-500 pb-3 pt-3"
          to={[
            routes.base.build({ tabId: String(tabId) }),
            routes.publ.build(dp),
            "?unsafe",
          ].join("/")}
        >
          上記を理解して組織情報や出版物の内容を閲覧する
      </Link>
    </div>
  );
}

function Prohibition({ dp, tabId }: ProhibitionProps) {
    return (
    <main className="fixed top-0 left-0 z-10 bg-white w-screen h-screen overflow-y-auto px-4 py-12">
      <ProjectTitle className="mb-12" as="header" />
      <h1 className="flex items-center flex-col gap-4 mb-12">
        <span className="text-red-700 h-7 text-base font-normal tracking-normal text-center whitespace-nowrap inline-block align-middle">
          <Icon
            icon="clarity:exclamation-triangle-line"
            className="text-red-700 text-5xl font-normal tracking-normal leading-10 text-center w-11 h-11 inline-block vertical-align"
          />{" "}
          アクセスにはご注意ください
        </span>
        <br />
        <span className="text-red-700 text-xl font-bold tracking-normal text-center w-96 h-6 inline-block align-middle">
          このサイトの発信元が確認できません
        </span>
      </h1>
      <article className="mb-12 max-w-sm mx-auto">
        <p className="text-sm tracking-normal text-left font-normal">
          本物そっくりの偽サイトにログインしたり個人情報を登録したり支払いをしてしまい被害に合うケースが多発しています。
          <br />
          このページではサイトの運営者情報が確認できませんでした。そのため、この
          <strong className="font-bold">
            サイトが本物かどうかは充分に注意してください。
          </strong>
        </p>
        <details className="text-gray-700 pt-3">
          <summary>
            このメッセージが表示される理由についてもっと詳しく...
          </summary>
          <WarningDetails dp={dp} tabId={tabId}/>
        </details>
        <div className="pt-3">
          <ProjectSummary as="footer" />
        </div>
      </article>
    </main>
  );
}

export default Prohibition;
