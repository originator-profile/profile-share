import { forwardRef, useId } from "react";
import { useWindowSize } from "react-use";
import useElements from "../utils/use-elements";
import useRect from "../utils/use-rect";
import { DocumentProfile } from "@originator-profile/ui";

function Rect({
  element,
  className,
  ...props
}: {
  element: HTMLElement;
  className?: string;
} & React.SVGAttributes<SVGRectElement>) {
  const { rect } = useRect(element);
  if (!rect) return null;
  return (
    <rect
      className={className}
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      {...props}
    />
  );
}

type Props = {
  className?: string;
  dps: DocumentProfile[];
};

export default forwardRef<SVGSVGElement, Props>(function DpArea(
  { className, dps },
  ref,
) {
  const { width, height } = useWindowSize();
  const { elements } = useElements(dps);
  const id = useId();
  return (
    <svg
      className={className}
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      <defs>
        <mask id={id}>
          <rect className="fill-white" x="0" y="0" width="100%" height="100%" />
          {elements.map((element, index) => (
            <Rect key={index} className="fill-black" element={element} />
          ))}
        </mask>
      </defs>
      <rect
        className="fill-black/25"
        x="0"
        y="0"
        width="100%"
        height="100%"
        mask={`url(#${id})`}
      />
      {elements.map((element, index) => (
        <Rect
          key={index}
          className="fill-transparent stroke-[#bc15ac] stroke-1"
          element={element}
          strokeDasharray="4"
        />
      ))}
    </svg>
  );
});
