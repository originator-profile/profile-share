import { Icon } from "@iconify/react";
import { Op } from "@webdino/profile-model";
import { isHolder } from "../utils/op";
import { OpHolder } from "../types/op";
import { Link } from "react-router-dom";

type Props = {
  op: Op;
  variant: "primary" | "secondary";
  onClick?: () => void;
};

function ProfileLogo({
  className,
  holder,
  variant,
}: {
  className?: string;
  holder: OpHolder;
  variant: Props["variant"];
}): React.ReactElement {
  const logo = holder.logo?.find(({ isMain }) => isMain);
  return (
    <img
      className={className}
      src={
        logo?.url ?? variant === "primary"
          ? "/assets/placeholder-logo-main.png"
          : "/assets/placeholder-logo-sub.png"
      }
      alt={`${holder.name}のロゴ`}
      width={variant === "primary" ? 640 : 180}
      height={variant === "primary" ? 396 : 112}
    />
  );
}

function ProfileItem({ op, variant }: Props): React.ReactElement {
  const holder = op.item.find(isHolder);
  if (!holder) return <div />;
  return (
    <div className="border-gray-200 border-b">
      {variant === "primary" && (
        <ProfileLogo className="w-full" holder={holder} variant={variant} />
      )}
      <div className="px-3 py-3 flex items-center gap-2">
        {variant === "secondary" && (
          <ProfileLogo
            css={{ width: 90 }}
            className="flex-shrink-0"
            holder={holder}
            variant={variant}
          />
        )}
        <div className="flex-1">
          <p className="text-base mb-1">{holder.name}</p>
          <p className="jumpu-tag text-sm bg-gray-100">
            コンテンツを出版しています
          </p>
        </div>
        <Link
          className="jumpu-icon-button flex-shrink-0 h-12"
          to={`/${encodeURIComponent(op.subject)}/holder`}
        >
          <Icon
            className="text-lg text-gray-300"
            icon="fa6-solid:chevron-right"
          />
        </Link>
      </div>
    </div>
  );
}

export default ProfileItem;
