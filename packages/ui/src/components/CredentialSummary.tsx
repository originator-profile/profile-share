import { twMerge } from "tailwind-merge";
import { OpCredential, OpCertifier } from "@originator-profile/model";
import Image from "../components/Image";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

type Props = {
  className?: string;
  credential: OpCredential;
  certifier?: OpCertifier;
  onClick(credential: OpCredential): void;
};

function CredentialSummary({
  className,
  credential,
  certifier,
  onClick,
}: Props) {
  const handleClick = () => onClick(credential);
  return (
    <button
      className={twMerge(
        "jumpu-card flex items-center gap-4 hover:bg-blue-50 px-4 py-3 rounded-lg",
        className,
      )}
      onClick={handleClick}
    >
      <Image
        src={credential.image}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={60}
        height={40}
      />
      <span className="flex flex-col gap-2 items-start">
        <span className="text-sm">{credential.name}</span>
        {certifier && (
          <span className="text-xs text-gray-600">{certifier.name} 発行</span>
        )}
      </span>
    </button>
  );
}

export default CredentialSummary;
