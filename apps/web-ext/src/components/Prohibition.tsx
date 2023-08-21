import { Dialog } from "@headlessui/react";
import { ProjectTitle, ProjectSummary } from "@originator-profile/ui";
import { Icon } from '@iconify/react';

function WarningDetails() {
  return (
    <div className="pt-3">
      <h2>Originator Profile ではこのサイトが本物であるかの確認を「認証鍵」という電子証明によって行っています。</h2>
      <br />
      <h2>このメッセージが表示されている場合、以下の2つの原因が考えられます。</h2>
      <br />
      <ol className="px-0.5 list-decimal">
        <li>(悪意のない正当な組織担当者が)認証鍵の取り扱いについて何らかの誤りがある</li>
        <li>(悪意のある第三者が)認証鍵を改ざんし、偽サイトを本物のように見せようとしている</li>
      </ol>
      <br />
      <h2>特に 2. の場合はあなたを欺き不利益を与える危険なサイトと考えられます。</h2>
      <br />
      <h2>これらの理由によりこのサイトが偽サイトである可能性をあなたにお伝えしています。</h2>
      <h2>証明書は改ざん・偽装されている可能性があるのでご注意ください。</h2>
      <br />
      <h2 className="text-gray-500 pb-3">
        上記を理解して組織情報や出版物の内容を閲覧する
      </h2>
    </div>
  );
}

function Prohibition() {
  const onClose = () => {
    // nop
  };
  return (
    <Dialog open onClose={onClose}>
      <Dialog.Panel className="fixed top-0 left-0 z-10 bg-white w-screen h-screen overflow-y-auto">
        <main className="px-4 py-12">
          <ProjectTitle className="mb-12" as="header" />
          <h1 className="flex items-center flex-col gap-4 mb-12">
            <p className="text-red-700 h-7 text-base font-normal tracking-normal text-center whitespace-nowrap inline-block align-middle">
              <Icon icon="clarity:exclamation-triangle-line" className="text-red-700 text-5xl font-normal tracking-normal leading-10 text-center w-11 h-11 inline-block vertical-align"/> アクセスにはご注意ください
            </p>
            <br />
            <p className="text-red-700 text-xl font-bold tracking-normal text-center w-96 h-6 inline-block align-middle">このサイトの発信元が確認できません</p>
          </h1>
          <article className="mb-12 max-w-sm mx-auto">
            <h2 className="text-sm tracking-normal text-left font-normal">
              本物そっくりの偽サイトにログインしたり個人情報を登録したり支払いをしてしまい被害に合うケースが多発しています。
              <br />
              このページではサイトの運営者情報が確認できませんでした。そのため、この<strong className="font-bold">サイトが本物かどうかは充分に注意してください。</strong>
            </h2>
            <br />
            <details className="text-gray-700">
              <summary>このメッセージが表示される理由についてもっと詳しく...</summary>
                <WarningDetails />
            </details>
            <br />
            <ProjectSummary as="footer" />
          </article>
        </main>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Prohibition;
