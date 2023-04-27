import clsx from "clsx";
import logoUrl from "../assets/logo.svg";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

function ProjectTitle({ as: As = "section", className }: Props) {
  return (
    <As className={clsx("flex items-center flex-col gap-4 mb-12", className)}>
      <p className="text-gray-700 text-xs">
        良質な記事やメディアを容易に見分けられるようにする技術
      </p>
      <a
        className="flex justify-center items-center gap-2"
        href="https://originator-profile.org/"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img src={logoUrl} alt="" />
      </a>
    </As>
  );
}

export default ProjectTitle;
