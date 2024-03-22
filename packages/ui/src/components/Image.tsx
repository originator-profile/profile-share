import clsx from "clsx";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width?: number;
  height?: number;
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
      className={clsx(
        "flex justify-center items-center overflow-hidden",
        className,
      )}
      style={{ height, minWidth: width }}
    >
      <img
        className={clsx("w-full h-auto", 
        { 'object-cover': cover, 'object-contain': !cover }
        )}
        src={src ?? placeholderSrc}
        alt={alt}
        style={{ maxWidth: "240px", maxHeight: "44px" }}
        crossOrigin="anonymous"
      />
    </figure>
  );
}


export default Image;
