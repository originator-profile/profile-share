import useSWR from "swr";
import { Dp } from "@originator-profile/ui/src/types";
import { messages } from "./messages";
import { findAdvertiser } from "./scripting";
import clsx from "clsx";

type BidResponseProps = {
  className?: string;
  tabId: number;
  dp: Dp;
};

/** 広告取引記載情報検証結果 */
export function BidResponse(props: BidResponseProps) {
  const res = useSWR(
    {
      key: "bidresponse",
      tabId: props.tabId,
      frameIds: props.dp.frameIds ?? [],
    },
    findAdvertiser,
  );

  const message =
    messages[
      res.data === undefined
        ? "loading"
        : res.data.id === undefined
          ? "missing"
          : res.data.id === props.dp.issuer
            ? "match"
            : "mismatch"
    ];
  const textColor = {
    default: "text-gray-600",
    success: "",
    danger: "text-danger",
  }[message.color];

  return (
    <section className={props.className}>
      <h2 className="mb-1 text-gray-500">{messages.rtb}</h2>
      <p className={clsx("text-xs", textColor)}>{message.text}</p>
    </section>
  );
}
