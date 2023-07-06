import clsx from "clsx";

type Props = {
  className?: string;
  children: React.ReactNode;
};

function Header({ className, children }: Props) {
  return (
    <header
      className={clsx(
        "px-3 py-2 bg-white border-b border-gray-300 flex items-center gap-1",
        className,
      )}
    >
      {children}
    </header>
  );
}

export default Header;
