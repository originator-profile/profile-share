import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type Props = Parameters<typeof Link>[0];

function NavLink({ className, children, ...props }: Props) {
  return (
    <Link
      className={clsx(
        "px-4 py-2 flex items-center justify-between bg-white border border-gray-100 hover:border-blue-300 rounded text-base text-blue-600",
        className
      )}
      {...props}
    >
      {children}
      <Icon icon="fa6-solid:chevron-right" />
    </Link>
  );
}

export default NavLink;
