import clsx from "clsx";
import { Link, LinkProps } from "react-router-dom";
import { OpHolder } from "@originator-profile/model";
import HolderSummary from "./HolderSummary";

type Props = {
  className?: string;
  to: LinkProps["to"];
  holder: OpHolder;
};

function HolderSummaryCard({ className, to, holder }: Props) {
  return (
    <Link
      className={clsx("jumpu-card block border-gray-200 p-4 gap-2", className)}
      to={to}
    >
      <HolderSummary holder={holder} />
    </Link>
  );
}

export default HolderSummaryCard;
