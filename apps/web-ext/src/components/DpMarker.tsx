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
import useElements from "../utils/use-elements";
import useRects from "../utils/use-rects";
import useVerifyBody from "../utils/use-verify-body";
import Image from "./Image";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

function Marker({
  result,
  rects: [rect],
  ogWebsite,
  opHolder,
  active,
  onClick,
}: {
  result: ReturnType<typeof useVerifyBody>["result"];
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
          active ? "bg-blue-500 border-blue-500" : "bg-white border-white"
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
            active ? "fill-blue-500" : "fill-white"
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
}: {
  op: Op;
  dpLocator: DpLocator;
  children: ({
    result,
    rects,
  }: {
    result: ReturnType<typeof useVerifyBody>["result"];
    rects: DOMRect[];
  }) => React.ReactNode;
}) {
  const { result } = useVerifyBody(dpLocator, op.jwks);
  const { elements } = useElements(dpLocator.location);
  const { rects } = useRects(elements);
  return <>{children({ result, rects })}</>;
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
    <DpLocator op={op} dpLocator={dpLocator}>
      {({ result, rects }) => (
        <Marker
          result={result}
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
