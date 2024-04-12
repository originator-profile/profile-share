import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Modal, useModal } from "./dialog";

type Props = {
  className?: string;
  label: string;
  helpText: string;
};

function FormHelpText({ className, label, helpText }: Props) {
  const modal = useModal();
  return (
    <>
      <button
        type="button"
        className={clsx("leading-none align-middle", className)}
        onClick={modal.open}
      >
        <Icon
          className="text-lg text-gray-400"
          icon="material-symbols:help"
          onClick={modal.open}
        />
      </button>
      <Modal title={label} description={helpText} dialogRef={modal.ref} />
    </>
  );
}

export default FormHelpText;
