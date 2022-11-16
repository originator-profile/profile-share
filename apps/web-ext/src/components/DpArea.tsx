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
  const d = rects.reduce(
    (prev, current) =>
      prev +
      `M${current.left},${current.top} L${current.right},${current.top} L${current.right},${current.bottom} L${current.left},${current.bottom} Z `,
    `M0,0 V${height} H${width} V-${height} Z `
  );
  return (
    <svg
      className={className}
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      strokeDasharray="10 10"
    >
      <path d={d} />
    </svg>
  );
});
