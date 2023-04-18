import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Op } from "../types/profile";
import Image from "../components/Image";
import CertifierTable from "../components/CertifierTable";
import logoCertifierUrl from "../assets/logo-certifier.png";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

type Props = {
  className?: string;
  op: Op;
};

function CredentialDetail({ className, op }: Props) {
  return (
    <div
      id="ブランドセーフティ認証 第三者検証"
      className={clsx("jumpu-card p-4", className)}
    >
      <Image
        src={logoCertifierUrl}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={110}
        height={70}
      />
      <div className="inline-flex items-center gap-2 bg-blue-50 px-2 py-1 mb-3 rounded-sm">
        <Icon
          className="flex-shrink-0 text-blue-500 text-base"
          icon="akar-icons:circle-check-fill"
        />
        <p className="flex-1 font-bold text-blue-500 text-xs">
          第三者検証による認定です
        </p>
      </div>
      <CertifierTable op={op} />
    </div>
  );
}

export default CredentialDetail;
