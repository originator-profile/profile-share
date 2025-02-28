import { WebMediaProfile } from "@originator-profile/model";
import { Image } from "@originator-profile/ui";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import clsx from "clsx";
import { useEffect } from "react";
import { SupportedVerifiedCa } from "../credentials";
import useElements from "./use-elements";
import useRect from "./use-rect";

function Marker(props: {
  rect: ResizeObserverEntry["contentRect"];
  active: boolean;
  onClick: () => void;
  wmp?: WebMediaProfile;
}) {
  const width = 54;
  const height = 54;
  const border = 4;
  const tailWidth = 30;
  const tailHeight = 12;
  const isTopOverflow = props.rect.top < height + border + tailHeight;

  const renderPolygon = () => {
    return (
      <svg
        viewBox={`0 0 ${tailWidth} ${tailHeight}`}
        width={tailWidth}
        height={tailHeight}
        className={clsx(
          "absolute left-1/2 stroke-transparent -translate-x-1/2",
          isTopOverflow
            ? "top-0 -translate-y-full rotate-180"
            : "bottom-0 translate-y-full",
          props.active ? "fill-blue-500" : "fill-white",
        )}
      >
        <polygon points={`0,0 ${tailWidth / 2},${tailHeight} ${tailWidth},0`} />
      </svg>
    );
  };

  return (
    <div
      className="absolute"
      style={{
        top: isTopOverflow
          ? props.rect.top - border + tailHeight
          : props.rect.top - (height + border + tailHeight),
        left: props.rect.left - (width + border * 2) / 2,
      }}
    >
      <button
        className={clsx(
          "relative rounded",
          props.active ? "bg-blue-500" : "bg-white",
        )}
        title={props.wmp?.credentialSubject.name}
        onClick={props.onClick}
      >
        <Image
          className="border box-content rounded border-gray-100 bg-white m-1"
          src={props.wmp?.credentialSubject.logo?.id}
          placeholderSrc={placeholderLogoMainUrl}
          alt={props.wmp?.credentialSubject.name ?? ""}
          width={width}
          height={height}
        />
        {renderPolygon()}
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
  ca: SupportedVerifiedCa;
  wmp?: WebMediaProfile;
  active: boolean;
  onClickCa: (ca: SupportedVerifiedCa) => void;
};

export function CaMarker(props: Props) {
  const { elements } = useElements(props.ca.attestation.doc.target);
  const handleClick = () => props.onClickCa(props.ca);
  return (
    <>
      {elements.map((element, index) => (
        <Rect
          key={index}
          element={element}
          active={props.active}
          scroll={index === 0}
        >
          {({ rect }) => (
            <Marker
              rect={rect}
              active={props.active}
              onClick={handleClick}
              wmp={props.wmp}
            />
          )}
        </Rect>
      ))}
    </>
  );
}
