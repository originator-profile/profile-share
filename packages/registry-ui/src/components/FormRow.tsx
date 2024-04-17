import clsx from "clsx";
import FormHelpText from "./FormHelpText";

type Props = {
  htmlFor?: string;
  className?: string;
  label: string;
  required?: boolean;
  wide?: boolean;
  helpText?: string;
  children: React.ReactNode;
};

function FormRow({
  htmlFor,
  className,
  label,
  required = false,
  wide = true,
  helpText,
  children,
}: Props) {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row gap-2 md:gap-4 md:items-center",
        className,
      )}
    >
      <div
        className={clsx(
          "text-sm w-full flex-shrink-0",
          wide ? "md:w-40" : "md:w-24",
        )}
      >
        <label htmlFor={htmlFor}>
          <span>{label}</span>
          {required && <span className="text-xs text-danger ml-1">必須</span>}
        </label>

        {helpText && (
          <FormHelpText className="mx-1" label={label} helpText={helpText} />
        )}
      </div>
      <div className="w-full flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default FormRow;
