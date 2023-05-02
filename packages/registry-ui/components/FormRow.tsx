import clsx from "clsx";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  label: string;
  children: React.ReactNode;
};

function FormRow({ as: As = "label", className, label, children }: Props) {
  return (
    <As
      className={clsx(
        "flex flex-col md:flex-row gap-2 md:gap-4 md:items-center",
        className
      )}
    >
      <span className="text-sm font-bold text-gray-500 flex-shrink-0 w-32">
        {label}
      </span>
      {children}
    </As>
  );
}

export default FormRow;
