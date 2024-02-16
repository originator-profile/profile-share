import { forwardRef, useId } from "react";
import { useWindowSize } from "react-use";
import { Dp } from "@originator-profile/ui/src/types";
import useElements from "../utils/use-elements";
import useRects from "../utils/use-rects";

type Props = {
  className?: string;
  dps: Dp[];
};

export default forwardRef<SVGSVGElement, Props>(function DpArea(
  { className, dps },
  ref,
) {
  const { width, height } = useWindowSize();
  const { elements } = useElements(dps);
  const { rects } = useRects(elements);
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
          {rects.map((rect, index) => (
            <rect
              key={index}
              className="fill-black"
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
            />
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
      {rects.map((rect, index) => (
        <rect
          key={index}
          className="fill-transparent stroke-[#bc15ac] stroke-1"
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          strokeDasharray="4"
        />
      ))}
    </svg>
  );
});
