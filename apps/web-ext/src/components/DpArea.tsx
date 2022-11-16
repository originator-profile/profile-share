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
      strokeDasharray="10 10"
    >
      {rects.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
        />
      ))}
    </svg>
  );
});
