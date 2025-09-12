import { forwardRef } from "react";
import clsx from "clsx";

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  role?: "menuitem";
  selected?: boolean;
  active?: boolean;
  value: string;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, children, selected: _selected = false, active = false, value: _value, ...props }, ref) => {
    return (
      <li role="none">
        <button
          ref={ref}
          type="button"
          role="menuitem"
          className={clsx(
            "w-full py-2 text-left text-sm",
            "flex items-center",
            "focus:outline-none",
            {
              "font-bold": active, // Active state shows bold text like original
            },
            className
          )}
          {...props}
        >
          {children}
        </button>
      </li>
    );
  }
);

MenuItem.displayName = "MenuItem";