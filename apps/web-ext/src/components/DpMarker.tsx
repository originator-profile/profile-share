import { useEffect } from "react";
import clsx from "clsx";
import { Advertisement, OgWebsite, OpHolder } from "@originator-profile/model";
import {
  isAdvertisement,
  isOgWebsite,
  isOpHolder,
} from "@originator-profile/core";
import { Image } from "@originator-profile/ui";
import { Op, Dp } from "@originator-profile/ui/src/types";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import { DpLocator } from "../types/dp-locator";
import { isDpLocator } from "../utils/dp-locator";
import useElements from "../utils/use-elements";
import useRects from "../utils/use-rects";

type WebsiteOrAdvertisement = OgWebsite | Advertisement;

function Marker({
  result,
  rect,
  dpTitle,
  opHolder,
  active,
  onClick,
}: {
  result: { body?: string; bodyError?: string };
  rect: ResizeObserverEntry["contentRect"];
  dpTitle: WebsiteOrAdvertisement;
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
          "relative rounded",
          active ? "bg-blue-500" : "bg-white",
        )}
        title={`${opHolder.name} ${dpTitle.title} ${
          result && (result.bodyError ? result.bodyError : result.body ?? "")
        }`}
        onClick={onClick}
      >
        <Image
          className="border rounded border-gray-100 bg-white m-1"
          src={logo?.url}
          placeholderSrc={placeholderLogoMainUrl}
          alt={opHolder.name ?? ""}
          width={width}
          height={height}
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
  dpLocator,
  children,
  active,
}: {
  dpLocator: DpLocator;
  active: boolean;
  children: ({ rect }: { rect: DOMRect }) => React.ReactNode;
}) {
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
  return <>{children({ rect })}</>;
}

type Props = {
  dp: Dp;
  op: Op;
  active: boolean;
  onClickDp: (dp: Dp) => void;
};

function DpMarker({ dp, op, active, onClickDp }: Props) {
  const ogWebsite = dp.item.find(isOgWebsite);
  const advertisement = dp.item.find(isAdvertisement);
  const dpTitle = ogWebsite || advertisement;
  if (!dpTitle) return null;
  const handleClick = () => onClickDp(dp);
  const dpLocator = dp.item.find(isDpLocator);
  if (!dpLocator) return null;
  const opHolder = op.item.find(isOpHolder);
  if (!opHolder) return null;
  return (
    <DpLocator dpLocator={dpLocator} active={active}>
      {({ rect }) => (
        <Marker
          result={{ body: dp.body, bodyError: dp.bodyError }}
          rect={rect}
          dpTitle={dpTitle}
          opHolder={opHolder}
          active={active}
          onClick={handleClick}
        />
      )}
    </DpLocator>
  );
}

export default DpMarker;
