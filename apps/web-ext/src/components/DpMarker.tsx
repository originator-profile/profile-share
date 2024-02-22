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
import useElements from "../utils/use-elements";
import useRect from "../utils/use-rect";

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
          className="border box-content rounded border-gray-100 bg-white m-1"
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

function Rect({
  element,
  children,
  scroll,
  active,
}: {
  element: HTMLElement;
  active: boolean;
  scroll: boolean;
  children: ({ rect }: { rect: DOMRect }) => React.ReactNode;
}) {
  useEffect(() => {
    if (!active || !scroll) return;
    element.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [active, scroll, element]);
  const { rect } = useRect(element);
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
  const { elements } = useElements(dp);
  const ogWebsite = dp.item.find(isOgWebsite);
  const advertisement = dp.item.find(isAdvertisement);
  const dpTitle = ogWebsite || advertisement;
  if (!dpTitle) return null;
  const handleClick = () => onClickDp(dp);
  const opHolder = op.item.find(isOpHolder);
  if (!opHolder) return null;
  return (
    <>
      {elements.map((element, index) => (
        <Rect
          key={index}
          element={element}
          active={active}
          scroll={index === 0}
        >
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
        </Rect>
      ))}
    </>
  );
}

export default DpMarker;
