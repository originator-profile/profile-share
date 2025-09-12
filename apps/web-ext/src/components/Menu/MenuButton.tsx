import { forwardRef } from "react";
import clsx from "clsx";

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-haspopup"?: "menu" | "true";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          "inline-flex items-center justify-center",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MenuButton.displayName = "MenuButton";