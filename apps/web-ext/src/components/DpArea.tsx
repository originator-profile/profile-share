import { forwardRef } from "react";
import { useWindowSize } from "react-use";
import { Dp } from "../types/profile";
import { isDpLocator } from "../utils/dp-locator";
import useElements from "../utils/use-elements";
import useRects from "../utils/use-rects";

type Props = {
  className?: string;
  dps: Dp[];
};

export default forwardRef<SVGSVGElement, Props>(function DpArea(
  { className, dps },
  ref
) {
  const { width, height } = useWindowSize();
  const dpLocators = dps.flatMap((dp) => dp.item.filter(isDpLocator));
  const { elements } = useElements(
    dpLocators.map((dpLocator) => dpLocator.location)
  );
  const { rects } = useRects(elements);
  return (
    <svg
      className={className}
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      <defs>
        <mask id="mask">
          <rect className="w-full h-full fill-white" x="0" y="0" />
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
      <rect className="w-full h-full fill-black/25" x="0" y="0" mask="url(#mask)" />
      {rects.map((rect, index) => (
        <rect
          key={index}
          className="fill-transparent stroke-black stroke-2"
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          strokeDasharray="10 10"
        />
      ))}
    </svg>
  );
});
