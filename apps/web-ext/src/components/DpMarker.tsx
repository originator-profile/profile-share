import clsx from "clsx";
import { OgWebsite, OpHolder } from "@webdino/profile-model";
import {
  isOgWebsite,
  isDpText,
  isDpVisibleText,
  isDpHtml,
  isOpHolder,
} from "@webdino/profile-core";
import { Op, Dp, DpLocator } from "../types/profile";
import useRects from "../utils/use-rects";
import Image from "./Image";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

function Marker({
  rects,
  ogWebsite,
  opHolder,
  active,
  onClick,
}: {
  rects: ResizeObserverEntry["contentRect"][];
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
  return (
    <>
      {rects.map((rect, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: rect.top - (width + border + tailHeight),
            left: rect.left - (54 + border * 2) / 2,
          }}
        >
          <button
            className={clsx(
              "relative border-4 rounded-full shadow-xl",
              active ? "bg-blue-500 border-blue-500" : "bg-white border-white"
            )}
            title={`${opHolder.name} ${ogWebsite.title}`}
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
                "absolute bottom-0 left-1/2 stroke-transparent [transform:translate(-50%,100%)]",
                active ? "fill-blue-500" : "fill-white"
              )}
            >
              <polygon
                points={`0,0 ${tailWidth / 2},${tailHeight} ${tailWidth},0`}
              />
            </svg>
          </button>
        </div>
      ))}
    </>
  );
}

function DpLocator({
  dpLocator,
  children,
}: {
  dpLocator: DpLocator;
  children: ({ rects }: { rects: DOMRect[] }) => React.ReactNode;
}) {
  const { rects } = useRects(dpLocator);
  // TODO: visibleText / text / html 型の署名を検証して
  return <>{children({ rects })}</>;
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
  const dpLocator =
    dp.item.find(isDpVisibleText) ||
    dp.item.find(isDpText) ||
    dp.item.find(isDpHtml);
  if (!dpLocator) return null;
  const opHolder = op?.item.find(isOpHolder);
  if (!opHolder) return null;
  return (
    <DpLocator dpLocator={dpLocator}>
      {({ rects }) => (
        <Marker
          rects={rects}
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
