import clsx from "clsx";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width: number;
  height: number;
};

function Image({ className, src, placeholderSrc, alt, width, height }: Props) {
  return (
    <figure
      className={clsx("flex justify-center items-center bg-white", className)}
      style={{ height }}
    >
      <img
        className="w-auto"
        style={{ maxHeight: height }}
        src={src ?? placeholderSrc}
        alt={alt}
        width={width}
        height={height}
      />
    </figure>
  );
}

export default Image;
