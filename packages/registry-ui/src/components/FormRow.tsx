import clsx from "clsx";
import { Icon } from "@iconify/react";

type Props = {
  htmlFor?: string;
  className?: string;
  label: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
};

function FormRow({
  htmlFor,
  className,
  label,
  required = false,
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
      <div className="text-sm md:w-40 w-full flex-shrink-0">
        <label htmlFor={htmlFor}>
          <span>{label}</span>
          {required && <span className="text-xs text-danger ml-1">必須</span>}
        </label>

        {helpText && (
          <Icon
            className="text-lg text-gray-400"
            // TODO: デザインのアイコンと微妙に違うかも。必要なら差し替えて
            icon="material-symbols:help"
            // TODO: 表示方法をデザインに合わせて
            onClick={() => alert(helpText)}
          />
        )}
      </div>
      <div className="w-full flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default FormRow;
