import { Icon } from "@iconify/react";
import { Dp } from "../types/dp";
import { isWebsite } from "../utils/dp";
import { routes } from "../utils/routes";
import { Link } from "react-router-dom";
import Image from "./Image";

type Props = {
  dp: Dp;
  variant: "main" | "sub";
};

function DpItem({ dp, variant }: Props) {
  const website = dp.item.find(isWebsite);
  // TODO: ウェブサイトが存在しない場合の見た目
  if (!website) return <div />;
  return (
    <li className="border-gray-200 border-b">
      {variant === "main" && (
        <Image
          src={website?.image}
          placeholderSrc="/assets/placeholder-logo-main.png"
          alt=""
          width={320}
          height={198}
        />
      )}
      <div className="px-3 py-3 flex items-center gap-2">
        {variant === "sub" && (
          <div css={{ width: 90 }} className="flex-shrink-0">
            <Image
              src={website?.image}
              placeholderSrc="/assets/placeholder-logo-sub.png"
              alt=""
              width={90}
              height={56}
            />
          </div>
        )}
        <p className="flex-1 text-sm">{website.title}</p>
        <Link
          className="jumpu-icon-button flex-shrink-0 h-12"
          to={routes.website.build({ issuer: dp.issuer, subject: dp.subject })}
          aria-describedby={`tooltip-${dp.subject}`}
        >
          <Icon
            className="text-lg text-gray-300"
            icon="fa6-solid:chevron-right"
          />
          <span id={`tooltip-${dp.subject}`} role="tooltip">
            詳細
          </span>
        </Link>
      </div>
    </li>
  );
}

export default DpItem;
