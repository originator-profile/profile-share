import { Icon } from "@iconify/react";
import { Op } from "../types/op";
import { isHolder } from "../utils/op";
import { Link } from "react-router-dom";
import Image from "./Image";

type Props = {
  op: Op;
  variant: "primary" | "secondary";
};

function OpItem({ op, variant }: Props) {
  const holder = op.item.find(isHolder);
  // TODO: 所有者が存在しない場合の見た目の実装
  if (!holder) return <div />;
  const logo = holder.logos?.find(({ isMain }) => isMain);
  return (
    <li className="border-gray-200 border-b">
      {variant === "primary" && (
        <Image
          src={logo?.url}
          placeholderSrc="/assets/placeholder-logo-main.png"
          alt={`${holder.name}のロゴ`}
          width={320}
          height={198}
        />
      )}
      <div className="px-3 py-3 flex items-center gap-2">
        {variant === "secondary" && (
          <div css={{ width: 90 }} className="flex-shrink-0">
            <Image
              src={logo?.url}
              placeholderSrc="/assets/placeholder-logo-sub.png"
              alt={`${holder.name}のロゴ`}
              width={90}
              height={56}
            />
          </div>
        )}
        <div className="flex-1">
          <p className="text-base mb-1">{holder.name}</p>
          <p className="jumpu-tag hover:border-transparent cursor-auto text-sm bg-gray-100">
            コンテンツを出版しています
          </p>
        </div>
        <Link
          className="jumpu-icon-button flex-shrink-0 h-12"
          to={`/${encodeURIComponent(op.subject)}/holder`}
          aria-describedby={`tooltip-${op.subject}`}
        >
          <Icon
            className="text-lg text-gray-300"
            icon="fa6-solid:chevron-right"
          />
          <span id={`tooltip-${op.subject}`} role="tooltip">
            詳細
          </span>
        </Link>
      </div>
    </li>
  );
}

export default OpItem;
