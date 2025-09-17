import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
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
    const internalRef = useRef<HTMLUListElement>(null);

    // Combine refs using a callback ref
    const setRefs = useCallback(
      (node: HTMLUListElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        // Force reflow for smooth animation
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      } else {
        setIsVisible(false);

        // Listen for transition end instead of using setTimeout
        const element = internalRef.current;
        if (element) {
          const handleTransitionEnd = (e: TransitionEvent) => {
            // Only handle opacity transition to avoid multiple triggers
            if (e.propertyName === "opacity" && !isOpen) {
              setShouldRender(false);
            }
          };

          element.addEventListener("transitionend", handleTransitionEnd);

          return () => {
            element.removeEventListener("transitionend", handleTransitionEnd);
          };
        }
      }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
      <ul
        ref={setRefs}
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
