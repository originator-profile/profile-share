import { WebMediaProfile } from "@originator-profile/model";
import clsx from "clsx";
import { Link, LinkProps } from "react-router";
import WebMediaProfileSummary from "./WebMediaProfileSummary";

type Props = {
  className?: string;
  to: LinkProps["to"];
  wmp: WebMediaProfile;
};

function WebMediaProfileSummaryCard({ className, to, wmp }: Props) {
  return (
    <Link
      className={clsx("jumpu-card block border-gray-200 p-4 gap-2", className)}
      to={to}
    >
      <WebMediaProfileSummary wmp={wmp} />
    </Link>
  );
}

export default WebMediaProfileSummaryCard;
