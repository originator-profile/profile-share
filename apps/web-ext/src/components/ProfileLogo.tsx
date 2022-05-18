import clsx from "clsx";

type Props = {
  className?: string;
  src?: string;
  placeholderSrc: string;
  alt: string;
  width: number;
  height: number;
};

function ProfileLogo({
  className,
  src,
  placeholderSrc,
  alt,
  width,
  height,
}: Props) {
  return (
    <img
      css={{ maxHeight: height }}
      className={clsx("bg-white mx-auto w-auto", className)}
      src={src ?? placeholderSrc}
      alt={alt}
      width={width}
      height={height}
    />
  );
}

export default ProfileLogo;
