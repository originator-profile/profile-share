import { useCallback } from "react";
import clsx from "clsx";

interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
  role?: "menu";
  "aria-labelledby"?: string;
  isOpen?: boolean;
  hasKeyboardFocus?: boolean;
  ref?: React.Ref<HTMLUListElement>;
}

export const Menu = ({
  className,
  children,
  isOpen = false,
  hasKeyboardFocus = false,
  ref,
  ...props
}: MenuProps) => {
  // Combine refs using a callback ref
  const setRefs = useCallback(
    (node: HTMLUListElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  if (!isOpen) return null;

  return (
    <ul
      ref={setRefs}
      className={clsx(
        "absolute z-20 min-w-0 rounded-lg bg-white py-2 shadow-lg",
        "focus:outline-none",
        "opacity-100 scale-100",
        "transition-all duration-100 ease-out",
        "animate-in fade-in zoom-in-95",
        {
          "ring-2 ring-blue-500": hasKeyboardFocus,
        },
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
};

Menu.displayName = "Menu";
