import clsx from "clsx";
import { OpCredential, OpHolder } from "@webdino/profile-model";
import Image from "../components/Image";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import { getVerificationType } from "../utils/credential";

type Props = {
  className?: string;
  credential: OpCredential;
  holder: OpHolder;
  onClick(): void;
};

function CredentialSummary({ className, credential, holder, onClick }: Props) {
  return (
    <button
      className={clsx(
        "flex items-center gap-4 hover:bg-primary-50 p-2 rounded-sm",
        className,
      )}
      onClick={onClick}
    >
      <Image
        src={credential.image}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={55}
        height={35}
      />
      <span className="text-sm font-bold text-gray-700">
        {credential.name} {getVerificationType(credential, holder)}
      </span>
    </button>
  );
}

export default CredentialSummary;
