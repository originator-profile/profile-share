import clsx from "clsx";
import logomarkUrl from "../assets/logomark.svg";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

function ProjectSummary({ as: As = "section", className }: Props) {
  return (
    <As
      className={clsx(
        "flex flex-col items-center gap-6 bg-gray-100 rounded-md p-8",
        className
      )}
    >
      <a
        className="flex justify-center items-center gap-2"
        href="https://originator-profile.pages.dev"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img src={logomarkUrl} alt="" />
        <h1 className="font-bold font-sans text-xl">Originator Profile</h1>
      </a>
      <p className="text-gray-700">
        Originator Profile
        技術は、ウェブコンテンツの作成者や広告主などの情報を検証可能な形で付与することで、第三者認証済みの良質な記事やメディアを容易に見分けられるようにする技術です。
      </p>
      <p className="text-gray-700">
        コンテンツ作成者や流通経路の透明性を高め、信頼できる発信者を識別可能にすることで、責任ある良質な記事やメディアの増加と価値向上を助けます。
      </p>
      <p className="text-xs text-center underline">
        <a
          href="https://originator-profile.pages.dev"
          target="_blank"
          rel="noreferrer noopener"
        >
          https://originator-profile.pages.dev
        </a>
      </p>
    </As>
  );
}

export default ProjectSummary;
