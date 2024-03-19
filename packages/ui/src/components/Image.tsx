import clsx from "clsx";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width?: number;
  height?: number;
};

function Image({
  className,
  src,
  placeholderSrc,
  alt,
  width,
  height,
}: Props) {
  return (
    <figure
      className={clsx(
        "flex justify-center items-center overflow-hidden",
        className,
      )}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      }}
    >
      <img
        className="w-full h-auto object-contain"
        src={src ?? placeholderSrc}
        alt={alt}
        style={{ maxWidth: '240px',maxHeight:'44px' }}
        crossOrigin="anonymous"
      />
    </figure>
  );
}

export default Image;