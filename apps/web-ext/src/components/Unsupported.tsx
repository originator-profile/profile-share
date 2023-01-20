import { Dialog } from "@headlessui/react";
import figUser1Url from "../assets/fig-user-1.svg";
import figUser2Url from "../assets/fig-user-2.svg";
import figUser3Url from "../assets/fig-user-3.svg";
import figUser4Url from "../assets/fig-user-4.svg";
import figUser5Url from "../assets/fig-user-5.svg";
import figTraceabilityUrl from "../assets/fig-traceability.png";
import {
  ProfileGenericError,
  ProfilesFetchFailed,
  ProfilesVerifyFailed,
} from "@webdino/profile-verify";
import ProjectTitle from "./ProjectTitle";
import ProjectSummary from "./ProjectSummary";

type Props = {
  error: Error;
};

function Unsupported({ error }: Props) {
  const onClose = () => {
    // nop
  };
  return (
    <Dialog open onClose={onClose}>
      <Dialog.Panel className="fixed top-0 left-0 z-10 bg-white w-screen h-screen overflow-y-auto">
        <main className="px-4 py-12">
          <ProjectTitle className="mb-12" as="header" />
          <article className="mb-12 max-w-sm mx-auto">
            <h1 className="text-lg mb-6 text-center">
              組織の信頼性情報と出版物の流通経路が
              <br />
              正しく読み取れませんでした
            </h1>
            <p className="text-xs text-gray-700 text-center mb-8">
              以下のような原因が考えられます
            </p>
            <ul className="list-disc pl-8 text-sm mb-12 max-w-sm mx-auto">
              {error instanceof ProfilesFetchFailed && (
                <>
                  <li>組織の信頼性情報と出版物の流通経路がまだありません</li>
                  <li>
                    組織の信頼性情報と出版物の流通経路の取得に失敗しました
                  </li>
                </>
              )}
              {error instanceof ProfilesVerifyFailed && (
                <>
                  <li>
                    信頼性情報あるいは流通経路が仕様どおりに記述されていません
                  </li>
                  <li>組織の信頼性情報が含まれていません</li>
                  <li>出版物の流通経路が含まれていません</li>
                </>
              )}
            </ul>
            <details className="text-gray-700 pl-4 mb-12">
              <summary>エラーの詳細</summary>
              <dl>
                <dt>
                  メッセージ<span aria-hidden>:</span>
                </dt>
                <dd>{error.message}</dd>
                {error instanceof ProfileGenericError && (
                  <>
                    <dt>
                      エラーコード<span aria-hidden>:</span>
                    </dt>
                    <dd>{error.code}</dd>
                  </>
                )}
              </dl>
            </details>
            <p className="text-xs text-gray-700 text-center leading-5">
              このページにおける組織の信頼性情報と出版物の流通経路について
              <br />
              知りたい場合はサイト内に記載されている
              <br />
              運営管理者にお問い合わせください
            </p>
          </article>
          <article className="prose max-w-lg mx-auto">
            <h1 className="text-lg mb-6 text-center font-normal">
              組織の信頼性情報と出版物の流通経路があることで
              <br />
              以下の課題を解決できます
            </h1>
            <section>
              <h2 className="after:content-[''] after:block after:absolute after:bg-sky-500 after:opacity-30 after:w-32 after:h-1 after:mt-1">
                一般的なネットユーザーの課題
              </h2>
              <div className="flex items-center justify-between gap-8 mb-4 md:mb-1">
                <img className="flex-shrink-0 my-0" src={figUser1Url} alt="" />
                <p className="text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
                  ちゃんと事実を伝えているウェブ上の記事とか広告とかって、信頼できる情報だけ見る方法はないのかしら...？
                </p>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-8 mb-4 md:mb-1">
                <img className="flex-shrink-0 my-0" src={figUser2Url} alt="" />
                <p className="text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
                  フェイクニュースや有害サイトってどうやってもなくならないの...？
                </p>
              </div>
              <p>
                アテンションエコノミー（関心を引くことの価値化）を背景に、事実を伝える記事より例えフェイクニュースであっても目立つ記事の方が利益が上がる構造ができています。これはコンテンツ発信者とその信頼性を確認する一般的な手段が無いことが大きな原因の一つです。閲覧者や広告配信システムが良質な記事やメディアを識別可能にすれば、インターネットの情報流通はより健全化できます。
              </p>
            </section>
            <section>
              <h2 className="after:content-[''] after:block after:absolute after:bg-sky-500 after:opacity-30 after:w-32 after:h-1 after:mt-1">
                広告・メディア関係者の課題
              </h2>
              <div className="flex items-center justify-between gap-8 mb-4 md:mb-1">
                <img className="flex-shrink-0 my-0" src={figUser5Url} alt="" />
                <p className="text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
                  えええー！？ こんな危険なサイトにウチの広告が！！
                </p>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-8 mb-4 md:mb-1">
                <img className="flex-shrink-0 my-0" src={figUser3Url} alt="" />
                <p className="text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
                  あれ、この記事の内容にウチの広告は合わないのでは！？
                </p>
              </div>
              <p>
                不適切なサイト (メディア)
                に広告が掲載されたり、逆に、表示して欲しくない広告が掲載されることがあります。検索結果に偽サイトなどが表示されたり、SNS
                でもフェイクニュースが目立った形で拡散されたりしています。適切なサイトや広告主を識別し、適切なサイトと広告のマッチングをしたり、その配信記録を残すことでブランド毀損を防げます。
              </p>
            </section>
            <section className="mb-12">
              <h2 className="after:content-[''] after:block after:absolute after:bg-sky-500 after:opacity-30 after:w-32 after:h-1 after:mt-1">
                一方で...
              </h2>
              <div className="flex items-center justify-between gap-8 mb-4 md:mb-1">
                <img className="flex-shrink-0 my-0" src={figUser4Url} alt="" />
                <p className="text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
                  でも、情報の規制は良くないよね、言論の自由も認められなければいけない
                </p>
              </div>
              <p>
                そのとおりです。ただし、Originator
                Profile技術はメディアや広告主の
                <ruby>
                  峻別
                  <rp>(</rp>
                  <rt>しゅんべつ</rt>
                  <rp>)</rp>
                </ruby>
                をおこなうものではありません。現存する認証機関などに活用してもらうことを考えています。
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-lg mb-6 text-center font-normal">
                もしも組織の信頼性情報と出版物の流通経路があると...
              </h2>
              <img
                className="mx-auto"
                src={figTraceabilityUrl}
                alt=""
                width={420}
                height={248}
              />
              <p>
                このページやコンテンツが誰のもとで作成・出版されたのかが見える化されて、虚偽、悪質なサイトも判別できるようになり、安心、安全なインターネット活用が可能になります。
              </p>
              <div className="flex justify-center">
                <a
                  className="jumpu-button text-white"
                  href="https://originator-profile.pages.dev"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Originator Profile をもっと詳しく
                </a>
              </div>
            </section>
          </article>
          <ProjectSummary as="footer" />
        </main>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Unsupported;
