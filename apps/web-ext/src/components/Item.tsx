import { useId } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Role } from "../types/role";
import clsx from "clsx";
import Image from "./Image";
import Roles from "../components/Roles";

type Props = {
  image?: string;
  name?: string;
  to: string;
  variant: "main" | "sub";
  roles?: Role[];
  onClick?: () => void;
};

function Item({ image, name, to, variant, roles = [], onClick }: Props) {
  const id = useId();
  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter") return;
    onClick?.();
  };
  const handleClickLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };
  return (
    <li className="border-gray-200 border-b">
      <div
        className={clsx({ ["hover:bg-gray-50 cursor-pointer"]: onClick })}
        tabIndex={0}
        role="button"
        onClick={onClick}
        onKeyUp={handleKeyUp}
      >
        {variant === "main" && (
          <Image
            src={image}
            placeholderSrc="/assets/placeholder-logo-main.png"
            alt=""
            width={320}
            height={198}
          />
        )}
        <div className="px-3 py-3 flex items-center gap-2">
          {variant === "sub" && (
            <div className="flex-shrink-0 w-[90px]">
              <Image
                src={image}
                placeholderSrc="/assets/placeholder-logo-sub.png"
                alt=""
                width={90}
                height={56}
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm mb-1">{name}</p>
            <Roles roles={roles} />
          </div>
          <Link
            className="jumpu-icon-button flex-shrink-0 h-12"
            to={to}
            aria-describedby={id}
            onClick={handleClickLink}
          >
            <Icon
              className="text-lg text-gray-300"
              icon="fa6-solid:chevron-right"
            />
            <span id={id} role="tooltip">
              詳細
            </span>
          </Link>
        </div>
      </div>
    </li>
  );
}

export default Item;
