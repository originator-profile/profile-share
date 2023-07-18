import { useEffect } from "react";
import clsx from "clsx";
import { OgWebsite, OpHolder } from "@originator-profile/model";
import { isOgWebsite, isOpHolder } from "@originator-profile/core";
import { Image } from "@originator-profile/ui";
import { Op, Dp } from "@originator-profile/ui/src/types";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import { DpLocator } from "../types/dp-locator";
import { isDpLocator } from "../utils/dp-locator";
import useElements from "../utils/use-elements";
import useRects from "../utils/use-rects";
import useVerifyBody from "../utils/use-verify-body";

function Marker({
  result,
  rect,
  ogWebsite,
  opHolder,
  active,
  onClick,
}: {
  result: ReturnType<typeof useVerifyBody>["result"];
  rect: ResizeObserverEntry["contentRect"];
  ogWebsite: OgWebsite;
  opHolder: OpHolder;
  active: boolean;
  onClick: () => void;
}) {
  const width = 54;
  const height = 54;
  const border = 4;
  const tailWidth = 30;
  const tailHeight = 12;
  const logo = opHolder.logos?.find(({ isMain }) => isMain);
  const isTopOverflow = rect.top < height + border + tailHeight;
  return (
    <div
      className="absolute"
      style={{
        top: isTopOverflow
          ? rect.top - border + tailHeight
          : rect.top - (height + border + tailHeight),
        left: rect.left - (width + border * 2) / 2,
      }}
    >
      <button
        className={clsx(
          "relative border-4 rounded-full shadow-xl",
          active ? "bg-blue-500 border-blue-500" : "bg-white border-white",
        )}
        title={`${opHolder.name} ${ogWebsite.title} ${
          result &&
          (result instanceof Error
            ? result.message
            : new TextDecoder().decode(result.payload))
        }`}
        onClick={onClick}
      >
        <Image
          src={logo?.url}
          placeholderSrc={placeholderLogoMainUrl}
          alt={opHolder.name ?? ""}
          width={width}
          height={height}
          rounded
        />
        <svg
          viewBox={`0 0 ${tailWidth} ${tailHeight}`}
          width={tailWidth}
          height={tailHeight}
          className={clsx(
            "absolute left-1/2 stroke-transparent -translate-x-1/2",
            isTopOverflow
              ? "top-0 -translate-y-full rotate-180"
              : " bottom-0 translate-y-full",
            active ? "fill-blue-500" : "fill-white",
          )}
        >
          <polygon
            points={`0,0 ${tailWidth / 2},${tailHeight} ${tailWidth},0`}
          />
        </svg>
      </button>
    </div>
  );
}

function DpLocator({
  op,
  dpLocator,
  children,
  active,
}: {
  op: Op;
  dpLocator: DpLocator;
  active: boolean;
  children: ({
    result,
    rect,
  }: {
    result: ReturnType<typeof useVerifyBody>["result"];
    rect: DOMRect;
  }) => React.ReactNode;
}) {
  const { result } = useVerifyBody(dpLocator, op.jwks);
  const { elements } = useElements(dpLocator.location);
  useEffect(() => {
    const [element] = elements;
    if (!active) return;
    element?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [active, elements]);
  const {
    rects: [rect],
  } = useRects(elements);
  if (!rect) return null;
  return <>{children({ result, rect })}</>;
}

type Props = {
  dp: Dp;
  op: Op;
  active: boolean;
  onClickDp: (dp: Dp) => void;
};

function DpMarker({ dp, op, active, onClickDp }: Props) {
  const ogWebsite = dp.item.find(isOgWebsite);
  if (!ogWebsite) return null;
  const handleClick = () => onClickDp(dp);
  const dpLocator = dp.item.find(isDpLocator);
  if (!dpLocator) return null;
  const opHolder = op.item.find(isOpHolder);
  if (!opHolder) return null;
  return (
    <DpLocator op={op} dpLocator={dpLocator} active={active}>
      {({ result, rect }) => (
        <Marker
          result={result}
          rect={rect}
          ogWebsite={ogWebsite}
          opHolder={opHolder}
          active={active}
          onClick={handleClick}
        />
      )}
    </DpLocator>
  );
}

export default DpMarker;
