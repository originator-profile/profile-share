import clsx from "clsx";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width: number;
  height: number;
  rounded?: boolean;
};

function Image({
  className,
  src,
  placeholderSrc,
  alt,
  width,
  height,
  rounded = false,
}: Props) {
  return (
    <figure
      className={clsx(
        "flex justify-center items-center",
        { "bg-white": !rounded },
        className
      )}
      style={{ height }}
    >
      <img
        className={clsx("w-auto", { ["rounded-full"]: rounded })}
        style={{ maxWidth: width, maxHeight: height }}
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
