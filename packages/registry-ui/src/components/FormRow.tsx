import clsx from "clsx";
import { Icon } from "@iconify/react";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  label: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
};

function FormRow({
  as: As = "label",
  className,
  label,
  required = false,
  helpText,
  children,
}: Props) {
  return (
    <As
      className={clsx(
        "flex flex-col md:flex-row gap-2 md:gap-4 md:items-center",
        className,
      )}
    >
      <div className="text-sm md:w-40 w-full flex-shrink-0">
        <span>{label}</span>
        {required && <span className="text-xs text-red-600 ml-1">必須</span>}
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

      {children}
    </As>
  );
}

export default FormRow;
