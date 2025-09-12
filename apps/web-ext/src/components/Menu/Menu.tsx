import { forwardRef, useEffect, useState } from "react";
import clsx from "clsx";

interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
  role?: "menu";
  "aria-labelledby"?: string;
  isOpen?: boolean;
  hasKeyboardFocus?: boolean;
}

export const Menu = forwardRef<HTMLUListElement, MenuProps>(
  (
    { className, children, isOpen = false, hasKeyboardFocus = false, ...props },
    ref,
  ) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        // Force reflow for smooth animation
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      } else {
        setIsVisible(false);
        // Wait for animation to complete before removing from DOM
        const timeout = setTimeout(() => {
          setShouldRender(false);
        }, 100); // Match animation duration

        return () => clearTimeout(timeout);
      }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
      <ul
        ref={ref}
        className={clsx(
          "absolute z-20 min-w-0 rounded-lg bg-white py-2 shadow-lg",
          "focus:outline-none",
          "transition-all duration-100",
          {
            "opacity-100 scale-100 ease-out": isVisible,
            "opacity-0 scale-95 ease-in": !isVisible,
            "ring-2 ring-blue-500": hasKeyboardFocus,
          },
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    );
  },
);

Menu.displayName = "Menu";
