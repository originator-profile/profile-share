import clsx from "clsx";
import { Link, LinkProps } from "react-router-dom";
import { Icon } from "@iconify/react";
import { OpHolder } from "@originator-profile/model";
import { Image } from "@originator-profile/ui";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import logomarkUrl from "@originator-profile/ui/src/assets/logomark.svg";

type Props = {
  className?: string;
  to: LinkProps["to"];
  holder: OpHolder;
};

function HolderSummary({ className, to, holder }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  return (
    <Link
      className={clsx("jumpu-card block border-gray-200", className)}
      to={to}
    >
      <div className="flex items-center gap-4 mx-4 my-3">
        <Image
          className="flex-shrink-0 border rounded border-gray-200"
          src={logo?.url}
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={52}
          height={52}
        />
        <div className="flex flex-col">
          <div className="flex flex-row">
            <p className="text-base font-bold">{holder.name}</p>
            <img
              className="ml-1"
              src={logomarkUrl}
              alt=""
              width={18}
              height={16}
            />
          </div>
          <div className="flex flex-row">
            {holder.publishingPrincipleUrl && (
              <div className="bg-gray-100 rounded-full px-1 py-1 mx-1 my-1">
                <p className="inline-flex items-center align-middle text-xs text-gray-600 px-1">
                  <Icon className="inline mr-1" icon="gg:check-o" />
                  編集ガイドライン
                </p>
              </div>
            )}
            {holder.privacyPolicyUrl && (
              <div className="bg-gray-100 rounded-full px-1 py-1 mx-1 my-1">
                <p className="inline-flex items-center align-middle text-xs text-gray-600 px-1">
                  <Icon className="inline mr-1" icon="gg:check-o" />
                  プライバシーポリシー
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HolderSummary;
