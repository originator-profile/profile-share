import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width: number;
  height: number;
  cover?: boolean;
};

function Image({
  className,
  src,
  placeholderSrc,
  alt,
  width,
  height,
  cover = false,
}: Props) {
  return (
    <figure
      className={twMerge(
        "flex justify-center items-center overflow-hidden",
        className,
      )}
      style={{ height, minWidth: width }}
    >
      <img
        className={twMerge("w-auto", cover ? "object-cover" : "object-contain")}
        style={
          cover ? { width, height } : { maxWidth: width, maxHeight: height }
        }
        src={src ?? placeholderSrc}
        alt={alt}
        width={width}
        height={height}
        crossOrigin="anonymous"
      />
    </figure>
  );
}

export default Image;
