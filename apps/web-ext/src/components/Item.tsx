import { useId } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Role } from "../types/role";
import clsx from "clsx";
import Image from "./Image";
import Roles from "../components/Roles";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import placeholderLogoSubUrl from "../assets/placeholder-logo-sub.png";

type Props = {
  className?: string;
  image?: string;
  name?: string;
  to?: string;
  variant: "main" | "sub";
  as?: React.ElementType;
  roles?: Role[];
  onClick?: () => void;
};

function ItemBase({
  className,
  image,
  name,
  variant,
  as: As = "li",
  roles = [],
  onClick,
  children,
}: Omit<Props, "to"> & { children?: React.ReactNode }) {
  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter") return;
    onClick?.();
  };
  return (
    <As className={clsx("border-gray-200 border-b", className)}>
      <div
        className={clsx({ ["hover:bg-gray-50 cursor-pointer"]: onClick })}
        tabIndex={0}
        role={onClick ? "button" : undefined}
        onClick={onClick}
        onKeyUp={handleKeyUp}
      >
        {variant === "main" && (
          <Image
            src={image}
            placeholderSrc={placeholderLogoMainUrl}
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
                placeholderSrc={placeholderLogoSubUrl}
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
          {children}
        </div>
      </div>
    </As>
  );
}

function Item({ to, ...props }: Props) {
  const id = useId();
  const handleClickLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };
  if (!to) return <ItemBase {...props} />;
  return (
    <ItemBase {...props}>
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
    </ItemBase>
  );
}

export default Item;
