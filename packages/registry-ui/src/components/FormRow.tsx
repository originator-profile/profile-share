import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Modal, useModal } from "./dialog";

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
  const modal = useModal();
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
          <button
            className="leading-none align-middle mx-1"
            onClick={modal.open}
          >
            <Icon
              className="text-lg text-gray-400"
              icon="material-symbols:help"
              onClick={modal.open}
            />
          </button>
        )}
      </div>
      <div className="w-full flex flex-col gap-2">{children}</div>
      {helpText && (
        <Modal title={label} description={helpText} dialogRef={modal.ref} />
      )}
    </div>
  );
}

export default FormRow;
