import clsx from "clsx";
import Image from "../components/Image";
import logoCertifierUrl from "../assets/logo-certifier.png";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

type Props = {
  className?: string;
};

function CredentialSummary({ className }: Props) {
  const handleClick = () => {
    const element = document.querySelector(
      "#" + CSS.escape("ブランドセーフティ認証 第三者検証")
    );
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button
      className={clsx(
        "flex items-center gap-4 hover:bg-primary-50 p-2 rounded-sm",
        className
      )}
      onClick={handleClick}
    >
      <Image
        src={logoCertifierUrl}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={55}
        height={35}
      />
      <span className="text-sm font-bold text-gray-700">
        ブランドセーフティ認証 第三者検証
      </span>
    </button>
  );
}

export default CredentialSummary;
