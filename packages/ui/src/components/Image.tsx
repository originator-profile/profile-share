import clsx from "clsx";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width?: number;
  height?: number;
  cover?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'; 
};

function Image({
  className,
  src,
  placeholderSrc,
  alt,
  width,
  height,
  cover = false,
  objectFit,
}: Props) {
  const effectiveObjectFit = cover ? 'cover' : objectFit || 'contain';

  return (
    <figure
      className={clsx(
        "flex justify-center items-center overflow-hidden",
        className,
      )}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      <img
        className="w-full h-auto"
        src={src ?? placeholderSrc}
        alt={alt}
        style={{ objectFit: effectiveObjectFit }}
        crossOrigin="anonymous"
      />
    </figure>
  );
}

export default Image;